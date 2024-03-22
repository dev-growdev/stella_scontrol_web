import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAppSelector } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectUser } from 'app/store/user/userSlice';
import { ChangeEvent, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { IsRateable } from './components/rateable/IsRateable';

import { getProducts } from '~/modules/s-control/pages/products/store/productsSlice';
import { useDispatchSControl, useSelectorSControl } from '~/modules/s-control/store/hooks';
import { getPaymentsForm } from '~/modules/s-control/store/slices/PaymentsFormSlice';
import { getCostCenters } from '~/modules/s-control/store/slices/costCenterSlice';
import { formattedNumeral } from '~/modules/s-control/utils/formatters/formatted-value';
import { getAccountingAccountByCostCenter, selectAccountingAccount } from '../../store/AccountingAccountSlice';
import {
	createRequestPaymentGeneral,
	listRequestsPaymentsByUser,
	selectedRequestPaymentGeneral
} from '../../store/FormRequestSlice';
import {
	AccountType,
	PaymentMethod,
	RequestUser,
	RequiredReceipt,
	TableProductsFromRequest,
	UploadFiles,
	ValueAndDueDate
} from './components';
import { mapToFormDTO } from './formatters/formatterToFormType';
import { TPaymentRequestForm, paymentRequestFormSchema } from './validations/paymentRequestForm.schema';

const defaultValues: TPaymentRequestForm = {
	paymentMethod: { name: '', uid: '' },
	valueProducts: null,
	sendReceipt: false,
	isRateable: false,
	products: [],
	description: '',
	supplier: '',
	payments: [{ value: '', dueDate: null }],
	uploadedFiles: [],
	accountingAccount: '',
	apportionments: []
};

export default function PaymentRequestFormGeneral() {
	const dispatch = useDispatchSControl();
	const navigate = useNavigate();
	const user = useAppSelector(selectUser);
	const requests = useSelectorSControl(selectedRequestPaymentGeneral);
	const [totalApportionmentsValue, setTotalApportionmentsValue] = useState(0);
	const [accountingAccountToOptionsSelect, setAccountingAccountToOptionsSelect] = useState<string[]>([]);
	const accountingAccountRedux = useSelectorSControl(selectAccountingAccount);
	const [totalValue, setTotalValue] = useState('');
	const [editMode, setEditMode] = useState(false);
	const [readMode, setReadMode] = useState(false);

	const { requestUid } = useParams();
	const { edit } = useParams();

	const [totalValueUnformatted, setTotalValueUnformatted] = useState(0);

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		register,
		formState: { errors },
		setError,
		clearErrors,
		reset,
		unregister
	} = useForm<TPaymentRequestForm>({
		defaultValues,
		resolver: zodResolver(paymentRequestFormSchema)
	});

	const {
		fields: fieldsPayments,
		append: appendPayments,
		remove: removePayments
	} = useFieldArray({
		control,
		name: 'payments'
	});

	const { remove: removeCostCenter } = useFieldArray({
		control,
		name: 'apportionments'
	});

	useEffect(() => {
		dispatch(listRequestsPaymentsByUser(user.uid));
	}, []);

	useEffect(() => {
		if (requestUid && requests.payload.length > 0) {
			if (edit) {
				setEditMode(true);
				setReadMode(false);
			} else {
				setReadMode(true);
			}

			const findRequest = requests.payload.find(request => request.uid === requestUid);
			const editValues = mapToFormDTO(findRequest);

			reset(editValues as TPaymentRequestForm);
		}
	}, [requestUid, requests]);

	useEffect(() => {
		const subscription = watch(value => {
			if (Array.isArray(value.payments)) {
				const total = value.payments.reduce((acc, current) => {
					const value = parseFloat(current.value.replace(',', '.')) || 0;
					return acc + value;
				}, 0);

				setTotalValue(formattedNumeral(total));
				setTotalValueUnformatted(total);
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	useEffect(() => {
		dispatch(getProducts());
		dispatch(getAccountingAccountByCostCenter(19));
		dispatch(getCostCenters());
		dispatch(getPaymentsForm());
	}, []);

	useEffect(() => {
		if (accountingAccountRedux.accountingAccount.length > 0) {
			const refAccountingAccount = accountingAccountRedux.accountingAccount
				.map(accountingAccount => accountingAccount.name)
				.filter(accountingAccount => accountingAccount);
			setAccountingAccountToOptionsSelect(refAccountingAccount);
		}
	}, [accountingAccountRedux]);

	useEffect(() => {
		const apportionments = watch('apportionments');
		if (apportionments.length > 0) {
			clearErrors('apportionments');
		}
	}, [watch('apportionments')]);

	async function validatePixAndCardHolder() {
		const formData = {
			...watch(),
			userCreatedUid: user.uid,
			totalValue
		};
		await paymentRequestFormSchema.parseAsync(formData);
	}

	async function handleSubmitFormRequest(data: TPaymentRequestForm) {
		console.log(data, '------------------------------------');
		await validatePixAndCardHolder();
		if (watch('isRateable')) {
			setValue('accountingAccount', '');
			const apportionments = watch('apportionments');

			if (apportionments.length === 0) {
				setError('apportionments', {
					message: 'É necessário adicionar rateio.'
				});
				return;
			}

			if (formattedNumeral(totalApportionmentsValue).toString() !== totalValue) {
				dispatch(
					showMessage({
						message: `O rateio deve ser igual ao valor total da solicitação.`,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'error'
					})
				);
				return;
			}
		}

		if (watch('isRateable') === false && watch('accountingAccount') === '') {
			dispatch(
				showMessage({
					message: `É necessário adicionar uma conta contábil.`,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);
			return;
		}

		const request = {
			...data,
			apportionments: data.apportionments.map(apportionment => ({
				...apportionment,
				value: apportionment.value.replace(/\./g, '').replace(',', '.')
			})),
			userCreatedUid: user.uid,
			totalValue: totalValue.replace(/\./g, '').replace(',', '.'),
			payments: data.payments.map(payment => ({ ...payment, value: payment.value.replace(',', '.') }))
		};

		const formData = new FormData();

		const json = JSON.stringify(request);
		formData.append('document', json);

		data.uploadedFiles.forEach(file => {
			formData.append('file', file);
		});

		dispatch(createRequestPaymentGeneral(formData)).then(res => {
			if (res.payload) {
				// clearFormState();
				// navigate('/scontrol/solicitacoes');
			}
		});
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;
		const filesArray = Array.from(files || []);

		const newUploadedFiles = filesArray.map(file => file);
		const updatedUploadedFiles = [...watch('uploadedFiles'), ...newUploadedFiles];

		setValue('uploadedFiles', updatedUploadedFiles);
	};

	const handleFileRemove = (indexToRemove: number) => {
		const currentFiles = [...watch('uploadedFiles')];
		const updatedFiles = currentFiles.filter((_file, index) => index !== indexToRemove);
		setValue('uploadedFiles', updatedFiles);
	};

	function clearFormState() {
		reset();
		if (readMode) {
			navigate(-1);
		}
	}

	function pageTitle() {
		if (editMode) {
			return 'Editar solicitação';
		}
		if (readMode) {
			return 'Visualizar solicitação';
		}
		return 'Abrir nova solicitação';
	}

	return (
		<Box className="flex flex-col w-full">
			<form
				onSubmit={handleSubmit(handleSubmitFormRequest)}
				className="p-32 mt-20"
			>
				<Button
					className="mb-12"
					variant="text"
					onClick={() => navigate('/scontrol/solicitacoes')}
					startIcon={<FuseSvgIcon>material-twotone:arrow_back_ios</FuseSvgIcon>}
				>
					SOLICITAÇÕES
				</Button>

				<Paper
					elevation={4}
					className="p-28"
				>
					<Typography
						className="text-20 md:text-28"
						component="h1"
						variant="h4"
						fontWeight={500}
						sx={{ color: theme => theme.palette.secondary.main }}
					>
						{pageTitle()}
					</Typography>
				</Paper>

				<Paper
					elevation={4}
					className="mt-24 p-36 flex flex-col gap-24"
				>
					<RequestUser user={user} />
					<Typography color="GrayText">
						{readMode
							? 'Visualize os produtos da sua solicitação.'
							: 'Adicione os produtos para solicitação de pagamento'}
					</Typography>

					<TableProductsFromRequest
						readMode={readMode}
						errors={errors}
						setValueProducts={setValue}
						watch={watch}
					/>

					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								{...register('description')}
								disabled={readMode}
								error={!!errors.description}
								helperText={errors?.description?.message}
								rows={4}
								label="Descrição da solicitação"
								multiline
							/>
						)}
					/>
					<Controller
						name="supplier"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								{...register('supplier')}
								disabled={readMode}
								error={!!errors.supplier}
								helperText={errors?.supplier?.message}
								label="Fornecedor"
								placeholder="Digite um CPF ou CNPJ"
							/>
						)}
					/>
					<div className="flex flex-col w-full ">
						<div>
							{fieldsPayments.map((field, index) => (
								<div
									className="my-24"
									key={field.id}
								>
									<ValueAndDueDate
										readMode={readMode}
										errors={errors}
										index={index}
										control={control}
										remove={removePayments}
									/>
								</div>
							))}
						</div>
						<div className="mb-28">
							<Typography>Valor total: R$ {totalValue}</Typography>
						</div>
						<div className="flex items-center">
							{!readMode && (
								<Button
									onClick={() => appendPayments({ value: '', dueDate: null })}
									className="rounded-4"
									variant="contained"
								>
									<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
									{watch('payments').length > 0
										? 'Adicionar mais pagamentos'
										: 'Adicionar algum pagamento'}
								</Button>
							)}
						</div>
					</div>
					<PaymentMethod
						readMode={readMode}
						selectedPaymentMethod={watch('paymentMethod')}
						control={control}
						setValue={setValue}
						errors={errors}
					/>
					<AccountType
						readMode={readMode}
						paymentMethod={watch('paymentMethod')}
						control={control}
						register={register}
						setValue={setValue}
						errors={errors}
						setError={setError}
						unregister={unregister}
						clearErrors={clearErrors}
					/>
					<RequiredReceipt
						sendReceipt={watch('sendReceipt')}
						setToggleCheck={e => setValue('sendReceipt', e)}
						readMode={readMode}
					/>
					<UploadFiles
						uploadedFiles={watch('uploadedFiles')}
						handleFileChange={handleFileChange}
						handleFileRemove={handleFileRemove}
						getFiles={watch('getFiles')}
						requestUid={requestUid}
						readMode={readMode}
					/>
					<IsRateable
						isRateable={watch('isRateable')}
						setToggleRateable={e => setValue('isRateable', e)}
						watch={watch}
						setValue={setValue}
						remove={removeCostCenter}
						errors={errors}
						setError={setError}
						totalApportionmentsValue={setTotalApportionmentsValue}
						totalValue={totalValueUnformatted}
						readMode={readMode}
					/>
					{!watch('isRateable') && (
						<Controller
							control={control}
							name="accountingAccount"
							render={({ field }) => (
								<Autocomplete
									className="w-full"
									value={field.value}
									onChange={(event: ChangeEvent<HTMLInputElement>) => {
										field.onChange(event.target.outerText);
									}}
									onBlur={field.onBlur}
									options={accountingAccountToOptionsSelect}
									renderInput={params => (
										<TextField
											{...params}
											label="Adicione uma conta contábil"
											error={!!errors.accountingAccount}
											helperText={errors?.accountingAccount?.message}
										/>
									)}
								/>
							)}
						/>
					)}
					<div className="flex justify-end gap-10 flex-col sm:flex-row">
						<Button
							variant="outlined"
							className="rounded-4"
							onClick={clearFormState}
						>
							{!readMode ? 'CANCELAR' : 'VOLTAR'}
						</Button>
						{!readMode && (
							<Button
								className="rounded-4"
								type="submit"
								variant="contained"
							>
								ENVIAR
							</Button>
						)}
					</div>
				</Paper>
			</form>
		</Box>
	);
}

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAppSelector } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectUser } from 'app/store/user/userSlice';
import { ChangeEvent, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { IsRateable } from './components/rateable/IsRateable';

import { getProducts, selectProducts } from '~/modules/s-control/products/store/productsSlice';
import { useDispatchSControl, useSelectorSControl } from '~/modules/s-control/store/hooks';
import { getPaymentsForm } from '~/modules/s-control/store/slices/PaymentsFormSlice';
import { getCostCenters } from '~/modules/s-control/store/slices/costCenterSlice';
import { formattedNumeral } from '~/modules/s-control/utils/formatters/formatted-value';
import { getAccountingAccountByCostCenter, selectAccountingAccount } from '../../store/AccountingAccountSlice';
import { createRequestPaymentGeneral } from '../../store/FormRequestSlice';
import {
	AccountType,
	PaymentMethod,
	RequestUser,
	RequiredReceipt,
	TableProductsFromRequest,
	UploadFiles,
	ValueAndDueDate
} from './components';
import { FormDataType } from './types/formData';
import { ProductOptionType } from './types/productOptions';
import { TPaymentRequestForm, paymentRequestFormSchema } from './validations/paymentRequestForm.schema';

const defaultValues: TPaymentRequestForm = {
	paymentMethod: '',
	valueProducts: null,
	requiredReceipt: false,
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
	const productsRedux = useSelectorSControl(selectProducts);
	const [productsToOptionsSelect, setProductsToOptionsSelect] = useState<ProductOptionType[]>([]);
	const [totalApportionmentsValue, setTotalApportionmentsValue] = useState(0);
	const [accountingAccountToOptionsSelect, setAccountingAccountToOptionsSelect] = useState<string[]>([]);
	const accountingAccountRedux = useSelectorSControl(selectAccountingAccount);
	const [totalValue, setTotalValue] = useState('');

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		register,
		reset,
		formState: { errors },
		setError,
		clearErrors,
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

	async function validatePixAndCardHolder() {
		const formData = {
			...watch(),
			userCreatedUid: user.uid,
			totalValue
		};
		await paymentRequestFormSchema.parseAsync(formData);
	}

	useEffect(() => {
		const subscription = watch(value => {
			if (Array.isArray(value.payments)) {
				const total = value.payments.reduce((acc, current) => {
					const value = parseFloat(current.value) || 0;
					return acc + value;
				}, 0);
				setTotalValue(total.toString());
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
		if (productsRedux.products.length > 0) {
			const refProducts = productsRedux.products
				.map(product => product.enable && { product: product.name })
				.filter(product => product);
			setProductsToOptionsSelect(refProducts);
		}

		if (accountingAccountRedux.accountingAccount.length > 0) {
			const refAccountingAccount = accountingAccountRedux.accountingAccount
				.map(accountingAccount => accountingAccount.name)
				.filter(accountingAccount => accountingAccount);
			setAccountingAccountToOptionsSelect(refAccountingAccount);
		}
	}, [productsRedux, accountingAccountRedux]);

	useEffect(() => {
		const apportionments = watch('apportionments');
		if (apportionments.length > 0) {
			clearErrors('apportionments');
		}
	}, [watch('apportionments')]);

	async function onSubmit(data: FormDataType) {
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

			if (totalApportionmentsValue.toString() !== totalValue) {
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

		const request = { ...data, userCreatedUid: user.uid, totalValue };

		const formData = new FormData();

		const json = JSON.stringify(request);
		formData.append('document', json);

		data.uploadedFiles.forEach(file => {
			formData.append('file', file);
		});

		dispatch(createRequestPaymentGeneral(formData)).then(res => {
			if (res.payload) {
				clearFormState();
				navigate('/scontrol/solicitacoes');
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
	}

	return (
		<Box className="flex flex-col w-full">
			<form
				onSubmit={handleSubmit(onSubmit)}
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
						Abrir nova solicitação
					</Typography>
				</Paper>

				<Paper
					elevation={4}
					className="mt-24 p-36 flex flex-col gap-24"
				>
					<RequestUser user={user} />
					<Typography color="GrayText">Adicione os produtos para solicitação de pagamento</Typography>

					<TableProductsFromRequest
						control={control}
						errors={errors}
						productsToOptions={productsToOptionsSelect}
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
										setValue={setValue}
										errors={errors}
										index={index}
										control={control}
										remove={removePayments}
									/>
								</div>
							))}
						</div>
						<div className="mb-28">
							<Typography>Valor total: R$ {formattedNumeral(parseFloat(totalValue))}</Typography>
						</div>
						<div className="flex items-center">
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
						</div>
					</div>
					<PaymentMethod
						selectedPaymentMethod={watch('paymentMethod')}
						control={control}
						register={register}
						errors={errors}
					/>
					<AccountType
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
						requiredReceipt={watch('requiredReceipt')}
						setToggleCheck={e => setValue('requiredReceipt', e)}
					/>
					<UploadFiles
						uploadedFiles={watch('uploadedFiles')}
						handleFileChange={handleFileChange}
						handleFileRemove={handleFileRemove}
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
					/>
					{!watch('isRateable') && (
						<Autocomplete
							className="w-full"
							options={accountingAccountToOptionsSelect}
							renderInput={params => (
								<TextField
									{...params}
									label="Escolha a Conta Contábil"
									{...register('accountingAccount')}
									error={!!errors.accountingAccount}
									helperText={errors?.accountingAccount?.message}
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
							CANCELAR
						</Button>
						<Button
							className="rounded-4"
							type="submit"
							variant="contained"
						>
							ENVIAR
						</Button>
					</div>
				</Paper>
			</form>
		</Box>
	);
}

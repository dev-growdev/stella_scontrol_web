import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { getCostCenters } from 'app/store/cost-center/costCenterSlice';
import { selectUser } from 'app/store/user/userSlice';
import { ChangeEvent, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { array, boolean, date, object, string } from 'yup';
import '../../../styles/muiCustomComponents.css';
import AccountType from '../../components/AccountType';
import IsRatiable from '../../components/IsRatiable';
import PaymentMethod from '../../components/PaymentMethod';
import RequestUser from '../../components/RequestUser';
import RequiredReceipt from '../../components/RequiredReceipt';
import TableProductsFromRequest from '../../components/TableProductsFromRequest';
import UploadFiles from '../../components/UploadFiles';
import ValueAndDueDate from '../../components/ValueAndDueDate';
import { getPaymentsForm } from '../payments-form/PaymentsFormSlice';
import { getProducts, selectProducts } from '../products/productsSlice';
import { createRequestPaymentGeneral } from './FormRequestSlice';

interface Payments {
	value: string;
	dueDate: Date | null;
}

export interface Apportionments {
	costCenter: string;
	accountingAccount: string;
	value: string;
}

export interface CardHolderToForm {
	uid: string;
	name: string;
}

export interface FormDataProps {
	paymentMethod: string;
	cardHolder?: CardHolderToForm;
	requiredReceipt: boolean;
	isRatiable: boolean;
	products: { product: string }[];
	description?: string;
	supplier: string;
	payments: Payments[];
	typeAccount: string;
	uploadedFiles: File[];
	apportionments?: Apportionments[];
}

export interface ProductOptionType {
	product: string;
}

const defaultValues = {
	paymentMethod: '',
	valueProducts: null,
	requiredReceipt: false,
	isRatiable: false,
	products: [],
	description: '',
	supplier: '',
	payments: [{ value: '', dueDate: null }],
	typeAccount: '',
	uploadedFiles: [],
	apportionments: []
};

const schema = object().shape({
	paymentMethod: string().required('É necessário adicionar uma forma de pagamento.'),
	requiredReceipt: boolean(),
	isRatiable: boolean(),
	products: array()
		.of(
			object()
				.shape({
					product: string().required()
				})
				.required('É necessário adicionar um produto.')
		)
		.min(1, 'É necessário adicionar um produto.'),
	description: string().required('É necessário uma descrição.'),
	supplier: string().required('É necessário adicionar um fornecedor.'),
	payments: array()
		.of(
			object().shape({
				value: string().required('É necessário um valor.'),
				dueDate: date().nullable().required('É necessário adicionar uma data de vencimento.')
			})
		)
		.required(),
	typeAccount: string(),
	uploadedFiles: array(),
	apportionments: array()
		.of(
			object().shape({
				costCenter: string().required('É necessário adicionar Centro de Custo.'),

				accountingAccount: string().required('É necessário adicionar Conta Contábil'),

				value: string().required()
			})
		)
		.notRequired()
});

export default function PaymentRequestFormGeneral() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useSelector(selectUser);
	const productsRedux = useSelector(selectProducts);
	const [productsToOptionsSelect, setProductsToOptionsSelect] = useState<ProductOptionType[]>([]);

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		register,
		reset,
		formState: { errors },
		setError,
		clearErrors
	} = useForm<FormDataProps>({
		defaultValues,
		resolver: yupResolver(schema)
	});

	const {
		fields: fieldsPayments,
		append: appendPayments,
		remove: removePayments
	} = useFieldArray({
		control,
		name: 'payments'
	});

	const { remove: removeCostCenter } = useFieldArray({ control, name: 'apportionments' });

	useEffect(() => {
		dispatch(getProducts());
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
	}, [productsRedux]);

	useEffect(() => {
		const apportionments = watch('apportionments');
		if (apportionments.length > 0) {
			clearErrors('apportionments');
		}
	}, [watch('apportionments')]);

	function onSubmit(data: FormDataProps) {
		console.log(data);
		if (watch('isRatiable')) {
			const apportionments = watch('apportionments');

			if (apportionments.length === 0) {
				setError('apportionments', { message: 'É necessário adicionar rateio.' });
				return;
			}
		}

		const request = { ...data, userCreatedUid: user.uid };

		const formData = new FormData();
		const json = JSON.stringify(request);
		formData.append('document', json);

		data.uploadedFiles.forEach(file => {
			formData.append('file', file);
		});

		dispatch(createRequestPaymentGeneral(formData)).then(res => {
			if (res.payload) {
				clearFormState();
				navigate('/solicitacoes');
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
					onClick={() => navigate('/solicitacoes')}
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
										errors={errors}
										index={index}
										control={control}
										register={register}
										remove={removePayments}
									/>
								</div>
							))}
						</div>
						<div className="flex items-center ">
							<Button
								onClick={() => appendPayments({ value: '', dueDate: null })}
								className="rounded-4"
								variant="contained"
							>
								<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
								{watch('payments').length > 0
									? 'Adicionar mais pagamentos.'
									: 'Adicionar algum pagamento.'}
							</Button>
						</div>
					</div>
					<PaymentMethod
						paymentMethod={watch('paymentMethod')}
						control={control}
						register={register}
						errors={errors}
					/>
					<AccountType
						paymentMethod={watch('paymentMethod')}
						control={control}
						register={register}
						accountType={watch('typeAccount')}
						setValue={setValue}
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
					<IsRatiable
						isRatiable={watch('isRatiable')}
						setToggleRatiable={e => setValue('isRatiable', e)}
						watch={watch}
						setValue={setValue}
						remove={removeCostCenter}
						errors={errors}
						setError={setError}
					/>
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

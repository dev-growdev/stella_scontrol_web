import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormHelperText, InputAdornment, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppDispatch } from 'app/store';
import { selectUser } from 'app/store/user/userSlice';
import { ptBR } from 'date-fns/locale';
import { ChangeEvent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { array, boolean, object, string } from 'yup';
import '../../../styles/muiCustomComponents.css';
import AccountType from '../../components/AccountType';
import CreatableOptions, { ProductOptionType } from '../../components/CreatableOptions';
import CustomizedTables from '../../components/CustomizedTables';
import IsRatiable from '../../components/IsRatiable';
import PaymentMethod from '../../components/PaymentMethod';
import RequestUser from '../../components/RequestUser';
import RequiredReceipt from '../../components/RequiredReceipt';
import UploadFiles from '../../components/UploadFiles';
import ValueAndDueDate from '../../components/ValueAndDueDate';
import { getProducts, selectProducts } from '../products/productsSlice';
import { createRequestPaymentGeneral } from './FormRequestSlice';

export interface FormDataProps {
	paymentMethod: string;
	requiredReceipt: boolean;
	isRatiable: boolean;
	tableData: { produtos: string }[];
	description?: string;
	supplier: string;
	payments: { value: string; dueDate: Date | null }[];
	typeAccount: string;
	uploadedFiles: File[];
}

const defaultValues = {
	paymentMethod: '',
	valueProducts: null,
	requiredReceipt: false,
	isRatiable: false,
	tableData: [],
	description: '',
	supplier: '',
	payments: [],
	typeAccount: '',
	uploadedFiles: []
};

const schema = object().shape({
	paymentMethod: string().required('É necessário adicionar uma forma de pagamento.'),
	requiredReceipt: boolean(),
	isRatiable: boolean(),
	tableData: array(),
	description: string(),
	supplier: string().required('É necessário adicionar um fornecedor.'),
	payments: array(),
	typeAccount: string(),
	uploadedFiles: array()
});

export default function PaymentRequestFormGeneral() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useSelector(selectUser);
	const productsRedux = useSelector(selectProducts);
	const [productsToOptionsSelect, setProductsToOptionsSelect] = useState<ProductOptionType[]>([]);
	const [productToTable, setProductToTable] = useState<ProductOptionType>({ name: '' });
	const [cleanInputCreatable, setCleanInputCreatable] = useState(false);
	const [paymentsState, setPaymentsState] = useState<{ value: string; dueDate: Date | null }>({
		value: '',
		dueDate: null
	});
	const [openTooltip, setOpenTooltip] = useState(false);
	const {
		control,
		handleSubmit,
		setValue,
		watch,
		register,
		reset,
		formState: { errors },
		setError
	} = useForm<FormDataProps>({
		defaultValues,
		resolver: yupResolver(schema)
	});

	const payments = [...watch('payments')];

	useEffect(() => {
		dispatch(getProducts());
	}, []);

	useEffect(() => {
		if (productsRedux.products.length > 0) {
			const refProducts = productsRedux.products
				.map(product => product.enable && { name: product.name })
				.filter(product => product);
			setProductsToOptionsSelect(refProducts);
		}
	}, [productsRedux]);

	useEffect(() => {
		if (paymentsState.value.length === 0) {
			setOpenTooltip(false);
		} else if (paymentsState.dueDate === null) {
			setOpenTooltip(false);
		} else {
			setOpenTooltip(true);
		}
	}, [paymentsState]);

	function onSubmit(data: FormDataProps) {
		const newRequest = {
			description: data.description,
			supplier: data.supplier,
			requiredReceipt: data.requiredReceipt,
			payments: data.payments
		};
		dispatch(createRequestPaymentGeneral(newRequest)).then(res => {
			if (res.payload) {
				clearFormState();
				navigate('/');
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

	const handleRemoveDueDate = (indexToRemove: number) => {
		const currentPayments = [...watch('payments')];
		const updatedPayments = currentPayments.filter((_payment, index) => index !== indexToRemove);
		setValue('payments', updatedPayments);
	};

	function handleAddProducts() {
		const currentTableData = watch('tableData');

		setValue('tableData', [...currentTableData, { produtos: productToTable.name }]);
		setProductToTable({ name: '' });
		setCleanInputCreatable(!cleanInputCreatable);
	}

	function getDataFromCreatable(data: ProductOptionType | string) {
		if (typeof data === 'string') {
			setProductToTable({ name: data });
		} else if (typeof data === 'object') {
			setProductToTable(data);
		}
	}

	function handleAddDueDate() {
		if (paymentsState.value === '' || paymentsState.dueDate === null) {
			setError('payments', { message: 'É necessário adicionar uma valor e uma data de vencimento.' });
		} else {
			setValue('payments', [...watch('payments'), paymentsState]);
			setPaymentsState({ value: '', dueDate: null });
		}
	}

	function clearFormState() {
		reset();
		setPaymentsState({ value: '', dueDate: null });
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

					<div className="flex items-center gap-24 flex-col sm:flex-row">
						<CreatableOptions
							selectedData={getDataFromCreatable}
							products={productsToOptionsSelect}
							cleanInput={cleanInputCreatable}
							control={control}
							errors={errors ?? undefined}
						/>
						<Button
							className="w-full sm:w-256"
							onClick={handleAddProducts}
							sx={{ borderRadius: '7px' }}
							variant="contained"
							startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
						>
							ADICIONAR ITEM
						</Button>
					</div>
					<CustomizedTables
						tableHead={['PRODUTOS']}
						tableData={watch('tableData')}
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
						<div className="flex flex-col w-full sm:flex-row items-center gap-24">
							<ValueAndDueDate
								errors={errors.payments ?? undefined}
								setFormDataDueDate={d => setPaymentsState(prevState => ({ ...prevState, dueDate: d }))}
								formData={paymentsState}
								setFormDataValue={e =>
									setPaymentsState(prevState => ({ ...prevState, value: e.target.value }))
								}
							/>

							<Tooltip
								placement="top-start"
								arrow
								title="Clique para vincular à solicitação de pagamento."
								open={openTooltip}
							>
								<Button
									onClick={handleAddDueDate}
									className="rounded-4"
									variant="contained"
								>
									<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
								</Button>
							</Tooltip>
						</div>
						{errors.payments && (
							<FormHelperText
								className="mt-10"
								error
							>
								{errors.payments.message}
							</FormHelperText>
						)}
						<div>
							{payments.length > 0 && (
								<>
									{payments.map((payment, index) => {
										return (
											<div key={payment.dueDate.toString()}>
												<div className="flex mt-24 flex-col sm:flex-row items-center gap-24">
													<TextField
														className="w-full"
														onChange={e => {
															const payments = [...watch('payments')];
															const newPayments = [...payments];
															newPayments[index] = {
																...newPayments[index],
																value: e.target.value
															};
															setValue('payments', newPayments);
														}}
														value={payment.value}
														type="number"
														label="Valor"
														InputProps={{
															startAdornment: (
																<InputAdornment position="start">R$</InputAdornment>
															),
															sx: { height: '3.73em' }
														}}
													/>

													<LocalizationProvider
														dateAdapter={AdapterDateFns}
														adapterLocale={ptBR}
													>
														<DatePicker
															onChange={e => {
																const payments = [...watch('payments')];
																const newPayments = [...payments];
																newPayments[index] = {
																	...newPayments[index],
																	dueDate: e
																};
																setValue('payments', newPayments);
															}}
															className="w-full"
															label="Vencimento"
															value={payment.dueDate}
															format="dd/MM/yyyy"
														/>
													</LocalizationProvider>

													<Button
														onClick={() => handleRemoveDueDate(index)}
														variant="text"
													>
														<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
													</Button>
												</div>
											</div>
										);
									})}
								</>
							)}
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

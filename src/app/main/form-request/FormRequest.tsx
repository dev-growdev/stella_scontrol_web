import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, InputAdornment, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectUser } from 'app/store/user/userSlice';
import { ptBR } from 'date-fns/locale';
import { ChangeEvent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
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
	paymentMethod: string[];
	valueProducts: { product: string } | null;
	requiredReceipt: boolean;
	isRatiable: boolean;
	tableData: { produtos: string }[];
	description: string;
	payments: { value: string; dueDate: Date | null }[];
	typeAccount: string;
	uploadedFiles: File[];
	valueTest: string;
	dateTest?: Date | null;
}

export default function PaymentRequestFormGeneral() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useSelector(selectUser);
	const productsRedux = useSelector(selectProducts);

	const [formData, setFormData] = useState<FormDataProps>({
		paymentMethod: [],
		valueProducts: null,
		requiredReceipt: false,
		isRatiable: false,
		tableData: [],
		description: '',
		payments: [],
		typeAccount: '',
		uploadedFiles: [],
		valueTest: ''
	});
	const [productsToOptionsSelect, setProductsToOptionsSelect] = useState<ProductOptionType[]>([]);
	const [productToTable, setProductToTable] = useState<ProductOptionType>({ name: '' });

	const [cleanInputCreatable, setCleanInputCreatable] = useState(false);
	const [paymentsState, setPaymentsState] = useState<{ value: string; dueDate: Date | null }>({
		value: '',
		dueDate: null
	});
	const [openTooltip, setOpenTooltip] = useState(false);

	const defaultValues = {
		paymentMethod: [],
		valueProducts: null,
		requiredReceipt: false,
		isRatiable: false,
		tableData: [],
		description: '',
		payments: [],
		typeAccount: '',
		uploadedFiles: [],
		valueTest: ''
	};
	const { control, handleSubmit, register, setValue, watch } = useForm<FormDataProps>({
		defaultValues
	});

	const payments = [...watch('payments')];
	const tableData = [...watch('tableData')];

	function onSubmit(data) {
		console.log(data);
	}
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

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;
		const filesArray = Array.from(files || []);

		const newUploadedFiles = filesArray.map(file => file);

		setFormData(prevState => ({
			...prevState,
			uploadedFiles: [...prevState.uploadedFiles, ...newUploadedFiles]
		}));
	};

	const handleFileRemove = (indexToRemove: number) => {
		setFormData(prevState => ({
			...prevState,
			uploadedFiles: prevState.uploadedFiles.filter((_file, index) => index !== indexToRemove)
		}));
	};

	const handleRemoveDueDate = (indexToRemove: number) => {
		setFormData(prevState => ({
			...prevState,
			payments: prevState.payments.filter((_payment, index) => index !== indexToRemove)
		}));
	};

	const handleChangeSelectPaymentMethod = (event: SelectChangeEvent<typeof formData.paymentMethod>) => {
		const { target } = event || {};
		const { value } = target || {};

		if (value !== undefined) {
			setFormData(prevState => ({
				...prevState,
				paymentMethod: typeof value === 'string' ? value.split(',') : value
			}));
		}
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

	const handleChangeTypeAccount = (event: SelectChangeEvent) => {
		setFormData(prevState => ({
			...prevState,
			typeAccount: event.target.value
		}));
	};

	function handleAddDueDate() {
		setValue('payments', [...watch('payments'), paymentsState]);
	}

	async function handleSubmitRequest() {
		const newRequest = {
			description: formData.description,
			sendReceipt: formData.requiredReceipt,
			payments: formData.payments
		};

		if (newRequest.description === '') {
			dispatch(
				showMessage({
					message: 'É necessário preencher uma descrição.',
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'warning'
				})
			);
		} else if (newRequest.payments.length === 0) {
			dispatch(
				showMessage({
					message: 'É necessário vincular valor e vencimento.',
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'warning'
				})
			);
		} else {
			dispatch(createRequestPaymentGeneral(newRequest)).then(res => {
				if (res.payload) {
					clearFormState();
					navigate('/solicitacoes');
				}
			});
		}
	}

	function clearFormState() {
		setFormData({
			paymentMethod: [],
			valueProducts: null,
			requiredReceipt: false,
			isRatiable: false,
			tableData: [],
			description: '',
			typeAccount: '',
			uploadedFiles: [],
			payments: [],
			valueTest: ''
		});
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
					VOLTAR
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
						tableData={tableData}
					/>

					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								rows={4}
								label="Descrição da solicitação"
								multiline
							/>
						)}
					/>

					<div className="flex flex-col w-full ">
						<div className="flex flex-col w-full sm:flex-row items-center gap-24">
							<ValueAndDueDate
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
						<div>
							{payments.length > 0 && (
								<>
									{payments.map((payment, index) => {
										return (
											<div key={payment.dueDate.toString()}>
												<div className="flex mt-24 flex-col sm:flex-row items-center gap-24">
													<TextField
														className="w-full"
														// onChange={e => {
														// 	const newValue = e.target.value;
														// 	setFormData(prevState => ({
														// 		...prevState,
														// 		payments: prevState.payments.map((payment, idx) =>
														// 			idx === index
														// 				? { ...payment, value: newValue }
														// 				: payment
														// 		)
														// 	}));
														// }}
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
															// onChange={e => {
															// 	const newDate = e;
															// 	setFormData(prevState => ({
															// 		...prevState,
															// 		payments: prevState.payments.map((payment, idx) =>
															// 			idx === index
															// 				? { ...payment, dueDate: newDate }
															// 				: payment
															// 		)
															// 	}));
															// }}
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
						formData={formData}
						handleChangeSelect={handleChangeSelectPaymentMethod}
						handleChangeTypeAccount={handleChangeTypeAccount}
					/>
					<AccountType
						formData={formData}
						handleChangeTypeAccount={handleChangeTypeAccount}
					/>

					<RequiredReceipt
						formData={formData}
						setFormData={setFormData}
					/>

					<UploadFiles
						formData={formData}
						handleFileChange={handleFileChange}
						handleFileRemove={handleFileRemove}
					/>

					<IsRatiable
						formData={formData}
						setFormData={setFormData}
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
							// onClick={handleSubmitRequest}
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

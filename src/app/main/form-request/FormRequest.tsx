import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppDispatch } from 'app/store';
import { selectUser } from 'app/store/user/userSlice';
import { ptBR } from 'date-fns/locale';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../../styles/muiCustomComponents.css';
import AccountType from '../../components/AccountType';
import CreatableOptions, { ProductOptionType } from '../../components/CreatableOptions';
import CustomizedTables from '../../components/CustomizedTables';
import IsRatiable from '../../components/IsRatiable';
import PaymentMethod from '../../components/PaymentMethod';
import RequestUser from '../../components/RequestUser';
import RequiredReceipt from '../../components/RequiredReceipt';
import UploadFiles from '../../components/UploadFiles';
import { getProducts, selectProducts } from '../products/productsSlice';
import { createRequestPaymentGeneral } from './FormRequestSlice';

export default function PaymentRequestFormGeneral() {
	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);
	const productsRedux = useSelector(selectProducts);
	const [formData, setFormData] = useState({
		paymentMethod: [],
		dueDate: null,
		valueProducts: null,
		requiredReceipt: false,
		isRatiable: false,
		tableData: [],
		description: '',
		totalValue: '',
		typeAccount: '',
		uploadedFiles: []
	});
	const [productsToOptionsSelect, setProductsToOptionsSelect] = useState<ProductOptionType[]>([]);
	const [cleanInputCreatable, setCleanInputCreatable] = useState(false);

	useEffect(() => {
		dispatch(getProducts());
	}, []);

	useEffect(() => {
		if (productsRedux.products.length > 0) {
			const refProducts = productsRedux.products
				.map(product => {
					if (product.enable) {
						return { name: product.name };
					}
				})
				.filter(product => product);
			setProductsToOptionsSelect(refProducts);
		}
	}, [productsRedux]);

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
			uploadedFiles: prevState.uploadedFiles.filter((file, index) => index !== indexToRemove)
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
		if (formData.valueProducts) {
			const newProduct = { produtos: formData.valueProducts.product };
			setFormData(prevState => ({
				...prevState,
				tableData: [...prevState.tableData, newProduct],
				valueProducts: null
			}));

			setCleanInputCreatable(!cleanInputCreatable);
		}
	}

	function handleCreatableProducts(data: ProductOptionType) {
		const newProduct = { produtos: data.name };

		setFormData(prevState => ({
			...prevState,
			tableData: [...prevState.tableData, newProduct],
			valueProducts: null
		}));
	}

	function getDataFromCreatable(data: ProductOptionType) {
		setFormData(prevState => ({
			...prevState,
			valueProducts: { product: data.name }
		}));
	}

	const handleChangeTypeAccount = (event: SelectChangeEvent) => {
		setFormData(prevState => ({
			...prevState,
			typeAccount: event.target.value
		}));
	};

	async function handleSubmitRequest() {
		const newRequest = {
			description: formData.description,
			sendReceipt: formData.requiredReceipt,
			totalRequestValue: +formData.totalValue,
			dueDate: formData.dueDate
		};

		dispatch(createRequestPaymentGeneral(newRequest));
	}

	function clearFormState() {
		setFormData({
			paymentMethod: [],
			dueDate: null,
			valueProducts: null,
			requiredReceipt: false,
			isRatiable: false,
			tableData: [],
			description: '',
			totalValue: '',
			typeAccount: '',
			uploadedFiles: []
		});
	}

	return (
		<Box className="flex flex-col w-full">
			<div className="p-32 mt-20">
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
							newData={handleCreatableProducts}
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
						tableData={formData.tableData}
					/>

					<TextField
						onChange={e => setFormData(prevState => ({ ...prevState, description: e.target.value }))}
						rows={4}
						label="Descrição da solicitação"
						multiline
					/>

					<div className="flex flex-col sm:flex-row items-center gap-24">
						<TextField
							onChange={e => setFormData(prevState => ({ ...prevState, totalValue: e.target.value }))}
							className="w-full"
							value={formData.totalValue}
							type="number"
							label="Valor"
							InputProps={{
								startAdornment: <InputAdornment position="start">R$</InputAdornment>,
								sx: { height: '3.73em' }
							}}
						/>

						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							adapterLocale={ptBR}
						>
							<DatePicker
								className="w-full"
								label="Vencimento"
								value={formData.dueDate}
								minDate={minDate}
								format="dd/MM/yyyy"
								onChange={d => setFormData(prevState => ({ ...prevState, dueDate: d }))}
							/>
						</LocalizationProvider>

						<Button
							className="rounded-4"
							onClick={handleSubmitRequest}
							variant="contained"
						>
							<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
						</Button>
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
							onClick={handleSubmitRequest}
							variant="contained"
						>
							ENVIAR
						</Button>
					</div>
				</Paper>
			</div>
		</Box>
	);
}

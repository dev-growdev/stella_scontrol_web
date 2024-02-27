import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
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
import { createRequestPaymentGeneral, findSupplierByCPForCNPJ } from './FormRequestSlice';
import { useNavigate } from 'react-router';

export default function PaymentRequestFormGeneral() {
	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);
	const [formData, setFormData] = useState({
		paymentMethod: [],
		dueDate: null,
		valueProducts: null,
		requiredReceipt: false,
		isRatiable: false,
		tableData: [],
		supplier: '',
		description: '',
		totalValue: '',
		typeAccount: '',
		uploadedFiles: []
	});
	const navigate = useNavigate();

	const currentDate = new Date();
	const minDate = new Date();
	minDate.setDate(currentDate.getDate() + 7);

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
			const newProduct = { produto: formData.valueProducts.product, marca: formData.valueProducts.brand };
			setFormData(prevState => ({
				...prevState,
				tableData: [...prevState.tableData, newProduct],
				valueProducts: null
			}));
		}
	}

	function handleCreatableProducts(data: ProductOptionType) {
		const newProduct = { produto: data.product, marca: data.brand };
		setFormData(prevState => ({
			...prevState,
			tableData: [...prevState.tableData, newProduct],
			valueProducts: null
		}));
	}

	function getDataFromCreatable(data: ProductOptionType) {
		setFormData(prevState => ({
			...prevState,
			valueProducts: { product: data.product, brand: data.brand }
		}));
	}

	const handleChangeTypeAccount = (event: SelectChangeEvent) => {
		setFormData(prevState => ({
			...prevState,
			typeAccount: event.target.value
		}));
	};

	async function handleSubmitRequest() {
		await dispatch(findSupplierByCPForCNPJ(formData.supplier));

		const newRequest = {
			supplier: formData.supplier,
			description: formData.description,
			sendReceipt: formData.requiredReceipt,
			totalRequestValue: +formData.totalValue,
			dueDate: formData.dueDate
		};

		dispatch(createRequestPaymentGeneral(newRequest));

		clearFormState();

		navigate('/solicitacoes');
	}

	function clearFormState() {
		setFormData({
			paymentMethod: [],
			dueDate: null,
			valueProducts: null,
			requiredReceipt: false,
			isRatiable: false,
			tableData: [],
			supplier: '',
			description: '',
			totalValue: '',
			typeAccount: '',
			uploadedFiles: []
		});
	}

	const handleSupplierChange = e => {
		setFormData(prevState => ({ ...prevState, supplier: e.target.value }));
	};

	useEffect(() => {
		console.log(formData);
	}, [formData]);

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
						fontWeight={400}
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
							products={[]}
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
						tableHead={['PRODUTO', 'MARCA']}
						tableData={formData.tableData}
					/>

					<div className="flex items-center gap-24 flex-col sm:flex-row">
						<TextField
							className="w-full"
							type="text"
							label="Fornecedor"
							placeholder="Digite o CPF ou CNPJ do fornecedor"
							value={formData.supplier}
							onChange={handleSupplierChange}
						/>
					</div>

					<TextField
						onChange={e => setFormData(prevState => ({ ...prevState, description: e.target.value }))}
						multiline
						value={formData.description}
						rows={4}
						label="Descrição da solicitação"
					/>

					<div className="flex flex-col sm:flex-row items-center gap-24">
						<TextField
							onChange={e => setFormData(prevState => ({ ...prevState, totalValue: e.target.value }))}
							className="w-full"
							value={formData.totalValue}
							type="number"
							label="Valor total"
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

						<PaymentMethod
							formData={formData}
							handleChangeSelect={handleChangeSelectPaymentMethod}
							handleChangeTypeAccount={handleChangeTypeAccount}
						/>
					</div>

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

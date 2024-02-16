import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	Select,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	TextField,
	Typography,
	useTheme
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { SelectChangeEvent } from '@mui/material/Select';
import { Theme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectUser } from 'app/store/user/userSlice';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import '../../../styles/muiCustomComponents.css';
import CreatableOptions, { ProductOptionType } from '../../components/CreatableOptions';
import CustomizedTables from '../../components/CustomizedTables';
import { createRequestPaymentGeneral } from './FormRequestSlice';

const itemHeight = 48;
const itemPaddingTop = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: itemHeight * 4.5 + itemPaddingTop,
			width: 250
		}
	}
};

const paymentMethods = ['Boleto', 'Cartão de crédito', 'Cartão corporativo', 'Pix', 'Transferência bancária'];

function getStyles(name: string, personName: string[], theme: Theme) {
	return {
		fontWeight:
			personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
	};
}

export default function PaymentRequestFormGeneral() {
	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);
	const theme = useTheme();
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

	const currentDate = new Date();
	const minDate = new Date();
	minDate.setDate(currentDate.getDate() + 7);

	const handleFileChange = event => {
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

	const handleChangeSelect = (event: SelectChangeEvent<typeof formData.paymentMethod>) => {
		const {
			target: { value }
		} = event;
		setFormData(prevState => ({
			...prevState,
			paymentMethod: typeof value === 'string' ? value.split(',') : value
		}));
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
		const newRequest = {
			description: formData.description,
			sendReceipt: formData.requiredReceipt,
			totalRequestValue: +formData.totalValue,
			dueDate: formData.dueDate
		};

		dispatch(createRequestPaymentGeneral(newRequest)).then(res => {
			if (res.error) {
				dispatch(
					showMessage({
						message: `${res.error.message}`,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'error'
					})
				);
			} else {
				clearFormState();
				dispatch(
					showMessage({
						message: `Solicitação enviada com sucesso.`,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					})
				);
			}
		});
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
						fontWeight={400}
					>
						Abrir nova solicitação
					</Typography>
				</Paper>

				<Paper
					elevation={4}
					className="mt-24 p-36 flex flex-col gap-24"
				>
					<div className="flex flex-col gap-24 sm:flex-row">
						<TextField
							fullWidth
							disabled
							label="Usuário solicitante"
							value={user.data.displayName}
						/>
						<TextField
							fullWidth
							disabled
							label="Email"
							value={user.data.email}
						/>
						<TextField
							fullWidth
							disabled
							label="Centro de custo"
							value={user.role}
						/>
					</div>

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
							className="w-ful"
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

						<FormControl className="w-full">
							<InputLabel id="demo-multiple-name-label">Forma de pagamento</InputLabel>
							<Select
								labelId="demo-multiple-name-label"
								id="demo-multiple-name"
								value={formData.paymentMethod}
								onChange={handleChangeSelect}
								input={<OutlinedInput label="Forma de pagamento" />}
								MenuProps={MenuProps}
							>
								{paymentMethods.map(name => (
									<MenuItem
										key={name}
										value={name}
										style={getStyles(name, formData.paymentMethod, theme)} //testar o que acontece se remover
									>
										{name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					{formData.paymentMethod[0] === 'Pix' && <TextField label="Informe a chave pix" />}
					{formData.paymentMethod[0] === 'Transferência bancária' && (
						<div className="flex gap-24 justify-center">
							<div className="flex flex-col w-full gap-24">
								<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">
									<TextField
										fullWidth
										label="Banco"
									/>
									<TextField
										fullWidth
										label="Numero da conta"
									/>
									<TextField
										fullWidth
										label="Agência"
									/>
								</div>
								<div className="flex gap-24">
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">Tipo de conta</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={formData.typeAccount}
											label="Age"
											onChange={handleChangeTypeAccount}
										>
											<MenuItem value="Conta poupança">Conta poupança</MenuItem>
											<MenuItem value="Conta corrente">Conta corrente</MenuItem>
										</Select>
									</FormControl>
									<TextField
										fullWidth
										label="CPF ou CNPJ do Beneficiário"
									/>
								</div>
							</div>
						</div>
					)}
					{formData.paymentMethod.some(option => option.includes('Cartão')) && (
						<TextField label="selecionar ao portador" />
					)}

					<div className="flex flex-row items-center">
						<Typography
							className="mr-10"
							color="GrayText"
						>
							Necessita comprovante
						</Typography>
						<FormGroup className="flex flex-row flex-nowrap">
							<FormControlLabel
								control={
									<Checkbox
										onClick={() =>
											setFormData(prevState => ({ ...prevState, requiredReceipt: true }))
										}
										checked={formData.requiredReceipt}
									/>
								}
								label="Sim"
							/>
							<FormControlLabel
								control={
									<Checkbox
										onClick={() =>
											setFormData(prevState => ({ ...prevState, requiredReceipt: false }))
										}
										checked={!formData.requiredReceipt}
									/>
								}
								label="Não"
							/>
						</FormGroup>
					</div>

					<div className="flex flex-row items-center">
						<Typography
							className="mr-10"
							color="GrayText"
						>
							Anexar documentos
						</Typography>
						<div>
							<Button
								component="label"
								role="button"
								variant="outlined"
								sx={{
									borderColor: theme.palette.primary.main,
									color: theme.palette.primary.main
								}}
								className="border-solid border-2 rounded-4 min-h-[33px] max-h-[33px] pr-0 pl-7"
								tabIndex={-1}
								endIcon={
									<FuseSvgIcon
										sx={{
											borderColor: theme.palette.primary.main,
											backgroundColor: theme.palette.primary.main
										}}
										className="border-solid border-2 rounded-r-4 text-gray-50 m-0 h-[33px]"
									>
										heroicons-outline:upload
									</FuseSvgIcon>
								}
							>
								ANEXAR DOCUMENTO
								<input
									multiple
									type="file"
									onChange={handleFileChange}
									className="absolute hidden"
								/>
							</Button>
						</div>
					</div>
					{formData.uploadedFiles.length > 0 && (
						<>
							<Typography
								className="mr-10"
								color="GrayText"
							>
								Documentos anexados:
							</Typography>
							s
							<TableContainer component={Paper}>
								<TableBody className="flex flex-col">
									{formData.uploadedFiles.map((file, index) => (
										<TableRow key={index}>
											<TableCell>{file.name}</TableCell>
											<TableCell>
												<FuseSvgIcon
													onClick={() => handleFileRemove(index)}
													aria-label="delete"
													className="cursor-pointer text-gray-300"
												>
													heroicons-outline:trash
												</FuseSvgIcon>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</TableContainer>
						</>
					)}

					<div className="flex items-center">
						<Typography
							className="mr-10"
							color="GrayText"
						>
							Rateio
						</Typography>
						<FormGroup className="flex flex-row">
							<FormControlLabel
								control={
									<Checkbox
										onClick={() => setFormData(prevState => ({ ...prevState, isRatiable: true }))}
										checked={formData.isRatiable}
									/>
								}
								label="Sim"
							/>
							<FormControlLabel
								control={
									<Checkbox
										onClick={() => setFormData(prevState => ({ ...prevState, isRatiable: false }))}
										checked={!formData.isRatiable}
									/>
								}
								label="Não"
							/>
						</FormGroup>
					</div>
					<div className="flex justify-end gap-10 flex-col sm:flex-row">
						<Button
							variant="outlined"
							className="rounded-4"
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

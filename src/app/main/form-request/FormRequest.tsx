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
import { createRequest } from 'app/configs/service/request.service';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import '../../../styles/muiCustomComponents.css';
import CreatableOptions, { ProductOptionType } from '../../components/CreatableOptions';
import CustomizedTables from '../../components/CustomizedTables';

import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

const names = ['Boleto', 'Cartão de crédito', 'Cartão corporativo', 'Pix', 'Transferência bancária'];

function getStyles(name: string, personName: string[], theme: Theme) {
	return {
		fontWeight:
			personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
	};
}

const productsArray = [
	{ product: 'café', brand: 'melita' },
	{ product: 'cafézes', brand: 'tres corações' },
	{ product: 'cane azul', brand: 'sei lá' }
];

export default function FormRequest() {
	const theme = useTheme();
	const [formaDePagamento, setFormaDePagamento] = useState<string[]>([]);
	const [dueDate, setDueDate] = useState<Date | null>(null);
	const [valueProducts, setValueProducts] = useState<{ product: string; brand: string } | null>(null);
	const [inputValueProducts, setInputValueProducts] = useState('');
	const [requiredReceipt, setRequiredReceipt] = useState<boolean>(false);
	const [isRatiable, setIsRatiable] = useState<boolean>(false);
	const [tableData, setTableData] = useState([]);
	const [description, setDescription] = useState('');
	const [totalValue, setTotalValue] = useState('');
	const [typeAccount, setTypeAccount] = useState('');
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const currentDate = new Date();
	const minDate = new Date();
	minDate.setDate(currentDate.getDate() + 7);

	const [uploadedFiles, setUploadedFiles] = useState([]);

	useEffect(() => {
		console.log(uploadedFiles);
	}, [uploadedFiles]);

	const handleFileChange = event => {
		const files = event.target.files;
		let newUploadedFiles = [];
		// Loop através dos arquivos selecionados e adiciona-os ao estado
		for (let i = 0; i < files.length; i++) {
			newUploadedFiles.push(files[i]);
		}
		setUploadedFiles(prevUploadedFiles => [...prevUploadedFiles, ...newUploadedFiles]);
	};

	const handleFileRemove = indexToRemove => {
		setUploadedFiles(prevUploadedFiles => prevUploadedFiles.filter((file, index) => index !== indexToRemove));
	};

	const handleChangeSelect = (event: SelectChangeEvent<typeof formaDePagamento>) => {
		const {
			target: { value }
		} = event;
		setFormaDePagamento(typeof value === 'string' ? value.split(',') : value);
	};

	function handleAdd() {
		if (valueProducts) {
			const newProduct = { produto: valueProducts.product, marca: valueProducts.brand };
			setTableData([...tableData, newProduct]);
			setValueProducts(null);
		}
	}

	function testeCreatable(data: ProductOptionType) {
		const newProduct = { produto: data.product, marca: data.brand };
		setTableData([...tableData, newProduct]);
		setValueProducts(null);
	}
	function getDataFromCreatable(data: ProductOptionType) {
		setValueProducts({ product: data.product, brand: data.brand });
	}

	async function handleSubmitRequest() {
		const newRequest = {
			description,
			sendReceipt: requiredReceipt,
			totalRequestValue: +totalValue,
			dueDate
		};
		const res = await createRequest(newRequest);

		if (res.code === 201) {
			dispatch(
				showMessage({
					message: 'Solicitação cadastrada',
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);
			navigate('/solicitações');
		} else {
			dispatch(
				showMessage({
					message: `${res.message}`,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);
		}
	}

	const handleChangeTypeAccount = (event: SelectChangeEvent) => {
		setTypeAccount(event.target.value as string);
	};

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
							value="Misael Soares"
						/>
						<TextField
							fullWidth
							disabled
							label="Email"
							value="misa@gmail.com"
						/>
						<TextField
							fullWidth
							disabled
							label="Centro de custo"
							value="Dev"
						/>
					</div>

					<Typography color="GrayText">Adicione os produtos para solicitação de pagamento</Typography>

					<div className="flex items-center gap-24 flex-col sm:flex-row">
						<CreatableOptions
							selectedData={getDataFromCreatable}
							newData={testeCreatable}
							products={productsArray}
						/>
						<Button
							className="w-full sm:w-256"
							onClick={handleAdd}
							sx={{ borderRadius: '7px' }}
							variant="contained"
							startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
						>
							ADICIONAR ITEM
						</Button>
					</div>
					<CustomizedTables
						tableHead={['PRODUTO', 'MARCA']}
						tableData={tableData}
					/>

					<TextField
						onChange={e => setDescription(e.target.value)}
						multiline
						rows={4}
						label="Descrição da solicitação"
					/>

					<div className="flex flex-col sm:flex-row items-center gap-24">
						<TextField
							onChange={e => setTotalValue(e.target.value)}
							className="w-full"
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
								minDate={minDate}
								format="dd/MM/yyyy"
								onChange={d => setDueDate(d)}
							/>
						</LocalizationProvider>

						<FormControl className="w-full">
							<InputLabel id="demo-multiple-name-label">Forma de pagamento</InputLabel>
							<Select
								labelId="demo-multiple-name-label"
								id="demo-multiple-name"
								value={formaDePagamento}
								onChange={handleChangeSelect}
								input={<OutlinedInput label="Forma de pagamento" />}
								MenuProps={MenuProps}
							>
								{names.map(name => (
									<MenuItem
										key={name}
										value={name}
										style={getStyles(name, formaDePagamento, theme)}
									>
										{name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					{formaDePagamento[0] === 'Pix' && <TextField label="Informe a chave pix" />}
					{formaDePagamento[0] === 'Transferência bancária' && (
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
											value={typeAccount}
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
					{formaDePagamento.some(option => option.includes('Cartão')) && (
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
										onClick={() => setRequiredReceipt(true)}
										checked={requiredReceipt ? true : false}
									/>
								}
								label="Sim"
							/>
							<FormControlLabel
								control={
									<Checkbox
										onClick={() => setRequiredReceipt(false)}
										checked={requiredReceipt === false ? true : false}
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
								role={undefined}
								variant="outlined"
								sx={{
									borderRadius: '7px',
									border: `2px solid ${theme.palette.primary.main}`,
									minHeight: '33px',
									maxHeight: '33px',
									height: '33px',
									padding: '0 0 0 10px',
									color: theme.palette.primary.main
								}}
								tabIndex={-1}
								endIcon={
									<FuseSvgIcon
										sx={{
											border: `2px solid ${theme.palette.primary.main}`,
											borderRadius: '0 7px 7px 0',
											color: theme.palette.common.white,
											backgroundColor: theme.palette.primary.main,
											margin: '0',
											height: '30px'
										}}
									>
										heroicons-outline:upload
									</FuseSvgIcon>
								}
							>
								ANEXAR DOCUMENTO
								<VisuallyHiddenInput
									multiple
									type="file"
									onChange={handleFileChange}
								/>
							</Button>
						</div>
					</div>
					{uploadedFiles.length > 0 && (
						<div>
							<Typography
								className="mr-10"
								color="GrayText"
							>
								Documentos anexados:
							</Typography>
							s
							<TableContainer component={Paper}>
								<TableBody className="flex flex-col">
									{uploadedFiles.map((file, index) => (
										<TableRow key={index}>
											<TableCell>{file.name}</TableCell>
											<TableCell>
												<FuseSvgIcon
													onClick={() => handleFileRemove(index)}
													aria-label="delete"
													sx={{ cursor: 'pointer', color: 'GrayText' }}
												>
													heroicons-outline:trash
												</FuseSvgIcon>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</TableContainer>
						</div>
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
										onClick={() => setIsRatiable(true)}
										checked={isRatiable ? true : false}
									/>
								}
								label="Sim"
							/>
							<FormControlLabel
								control={
									<Checkbox
										onClick={() => setIsRatiable(false)}
										checked={isRatiable === false ? true : false}
									/>
								}
								label="Não"
							/>
						</FormGroup>
					</div>
					<div className="flex justify-end gap-10 flex-col sm:flex-row">
						<Button
							variant="outlined"
							sx={{ borderRadius: '7px' }}
						>
							CANCELAR
						</Button>
						<Button
							onClick={handleSubmitRequest}
							sx={{ borderRadius: '7px' }}
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

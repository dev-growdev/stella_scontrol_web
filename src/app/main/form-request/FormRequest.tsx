import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Input, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Typography, useTheme } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { SelectChangeEvent } from '@mui/material/Select';
import { Theme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createRequest } from "app/configs/service/request.service";
import { useAppDispatch } from "app/store";
import { showMessage } from "app/store/fuse/messageSlice";
import { ptBR } from 'date-fns/locale';
import { useState } from "react";
import { useNavigate } from "react-router";
import '../../../styles/muiCustomComponents.css';
import CreatableOptions, { ProductOptionType } from "../../components/CreatableOptions";
import CustomizedTables from '../../components/CustomizedTables';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    "Boleto",
    "Cartão de crédito",
    "Cartão corporativo",
    "Pix",
    "Transferência bancária",

];

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const productsArray = [
    { product: 'café', brand: 'melita' },
    { product: 'cafézes', brand: 'tres corações' },
    { product: 'cane azul', brand: 'sei lá' },
]


export default function FormRequest() {
    const theme = useTheme();
    const [formaDePagamento, setFormaDePagamento] = useState<string[]>([]);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [valueProducts, setValueProducts] = useState<{ product: string, brand: string } | null>(null)
    const [inputValueProducts, setInputValueProducts] = useState("")
    const [requiredReceipt, setRequiredReceipt] = useState<boolean>(false)
    const [isRatiable, setIsRatiable] = useState<boolean>(false);
    const [tableData, setTableData] = useState([])
    const [description, setDescription] = useState("")
    const [totalValue, setTotalValue] = useState("")
    const navigate = useNavigate()
    const dispatch = useAppDispatch()


    const currentDate = new Date();
    const minDate = new Date();
    minDate.setDate(currentDate.getDate() + 7);

    const handleChangeSelect = (event: SelectChangeEvent<typeof formaDePagamento>) => {
        const {
            target: { value },
        } = event;
        setFormaDePagamento(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        console.log(files);
    };

    function handleAdd() {
        if (valueProducts) {
            console.log('handle add', valueProducts)
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
        setValueProducts({ product: data.product, brand: data.brand })
    }


    async function handleSubmitRequest() {
        const newRequest = {
            description,
            requiredReceipt,
            totalRequestValue: +totalValue,
            dueDate
        }
        const res = await createRequest(newRequest)

        if (res.code === 201) {
            dispatch(showMessage({
                message: "Solicitação cadastrada",
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                },
                variant: 'success'
            }))
            navigate('/solicitações')
        } else {
            dispatch(showMessage({
                message: `${res.message}`,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                },
                variant: 'error'
            }))
        }
    }



    return (
        <Box className="flex flex-col w-full">
            <div className="p-32 mt-20">
                <Button variant='text' startIcon={<FuseSvgIcon>material-twotone:arrow_back_ios</FuseSvgIcon>}>VOLTAR</Button>

                <Paper elevation={4} className="p-28">
                    <Typography className="text-20 md:text-28" component='h1' variant="h4" fontWeight={400}>Abrir nova solicitação</Typography>
                </Paper>

                <Paper elevation={4} className="mt-24 p-36 flex flex-col gap-24">
                    <div className="flex flex-col gap-24 sm:flex-row">
                        <TextField fullWidth disabled label="Usuário solicitante" value='Misael Soares' />
                        <TextField fullWidth disabled label="Email" value='misa@gmail.com' />
                        <TextField fullWidth disabled label="Centro de custo" value='Dev' />
                    </div>

                    <Typography color='GrayText'>Adicione os produtos para solicitação de pagamento</Typography>

                    <div className="flex items-center gap-24 flex-col sm:flex-row">
                        <CreatableOptions selectedData={getDataFromCreatable} newData={testeCreatable} products={productsArray} />
                        <Button className="w-full sm:w-144" onClick={handleAdd} sx={{ borderRadius: '7px' }} variant="contained" startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}>
                            ADICIONAR
                        </Button>
                    </div>
                    <CustomizedTables tableHead={["PRODUTO", 'MARCA']} tableData={tableData} />

                    <TextField onChange={(e) => setDescription(e.target.value)} multiline rows={4} label="Descrição da solicitação" />

                    <div className="flex flex-col sm:flex-row items-center gap-24">
                        <TextField onChange={(e) => setTotalValue(e.target.value)} className="w-full" type="number" label="Valor total" InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />

                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <DatePicker className="w-full" label="Vencimento" minDate={minDate} format="dd/MM/yyyy" onChange={(d) => setDueDate(d)} />
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
                                {names.map((name) => (
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
                    {formaDePagamento[0] === "Pix" && <TextField label="Informe a chave pix" />}
                    {formaDePagamento[0] === "Transferência bancária" && <div className="flex justify-around gap-24">
                        <div className="flex flex-col sm:flex-row gap-7">
                            <TextField label="Banco" />
                            <TextField label="Numero da conta" />
                            <TextField label="Dígito" />
                            <TextField label="Agência" />
                        </div>
                    </div>}
                    {formaDePagamento.some(option => option.includes("Cartão")) && <TextField label="selecionar ao portador" />}


                    <div className="flex items-center">
                        <div className="flex flex-col sm:flex-row items-center">
                            <Typography className="mr-10" color='GrayText'>Possui comprovante</Typography>
                            <FormGroup className="flex flex-row flex-nowrap">
                                <FormControlLabel control={
                                    <Checkbox onClick={() => setRequiredReceipt(true)} checked={requiredReceipt ? true : false} />
                                } label="Sim" />
                                <FormControlLabel control={
                                    <Checkbox onClick={() => setRequiredReceipt(false)} checked={requiredReceipt === false ? true : false} />
                                } label="Não" />
                            </FormGroup>
                            {requiredReceipt && <div>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload">
                                    <div style={{
                                        border: `2px solid ${theme.palette.primary.main}`,
                                        borderRadius: '7px',
                                        height: '30px'
                                    }}
                                        className="flex flex-row items-center">
                                        <Button
                                            variant="text"
                                            component="span"
                                        >
                                            ANEXAR DOCUMENTO
                                        </Button>
                                        <FuseSvgIcon sx={{
                                            border: `2px solid ${theme.palette.primary.main}`,
                                            borderRadius: '0 7px 7px 0',
                                            color: theme.palette.common.white,
                                            backgroundColor: theme.palette.primary.main,
                                            margin: '0',
                                            height: "30px"
                                        }}>heroicons-outline:upload</FuseSvgIcon>

                                    </div>
                                </label>
                            </div>}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Typography className="mr-10" color='GrayText'>Rateio</Typography>
                        <FormGroup className="flex flex-row">
                            <FormControlLabel control={<Checkbox onClick={() => setIsRatiable(true)} checked={isRatiable ? true : false} />} label="Sim" />
                            <FormControlLabel control={<Checkbox onClick={() => setIsRatiable(false)} checked={isRatiable === false ? true : false} />} label="Não" />
                        </FormGroup>
                    </div>
                    <div className="flex justify-end gap-10 flex-col sm:flex-row">

                        <Button sx={{ color: theme.palette.common.black }} variant="text" startIcon={
                            <FuseSvgIcon sx={{
                                color: theme.palette.common.black
                            }}>
                                heroicons-outline:printer
                            </FuseSvgIcon>}>
                            IMPRIMIR
                        </Button>
                        <Button variant="outlined" sx={{ borderRadius: '7px' }}>CANCELAR</Button>
                        <Button onClick={handleSubmitRequest} sx={{ borderRadius: '7px' }} variant="contained">ENVIAR</Button>
                    </div>
                </Paper>
            </div >
        </Box >

    )
}
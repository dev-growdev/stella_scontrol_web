
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Input, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Typography, useTheme } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { SelectChangeEvent } from '@mui/material/Select';
import { Theme } from '@mui/material/styles';
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
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
    "Pix"
];

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


export default function FormRequest() {
    const theme = useTheme();
    const [formaDePagamento, setFormaDePagamento] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState("");

    const currentDate = new Date();
    const minDate = new Date();
    minDate.setDate(currentDate.getDate() + 7);

    const handleChangeSelect = (event: SelectChangeEvent<typeof formaDePagamento>) => {
        const {
            target: { value },
        } = event;
        setFormaDePagamento(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        console.log(files);
    };



    return (

        <Box className="flex flex-col w-full">
            <div className="p-32 mt-20">
                <div>Aqui vai um botão - VOLTAR</div>
                <Paper elevation={4} className="p-28">
                    <Typography component='h1' variant="h4" fontWeight={400}>Abrir nova solicitação</Typography>
                </Paper>

                <Paper elevation={4} className="mt-24 p-36 flex flex-col gap-24">
                    <div className="flex">
                        <TextField fullWidth disabled label="Usuário solicitante" value='Misael Soares' />
                        <TextField fullWidth disabled label="Email" value='misa@gmail.com' />
                        <TextField fullWidth disabled label="Centro de custo" value='Dev' />
                    </div>

                    <Typography color='GrayText'>Adicione os produtos para solicitação de pagamento</Typography>

                    <div className="flex">
                        <TextField id="products" InputProps={{ endAdornment: (<FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>) }} label="Produto" inputProps={{ sx: { color: 'grey' } }} defaultValue="Buscar Produto" fullWidth />

                        <Button sx={{ borderRadius: '7px' }} variant="contained" startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}>
                            ADICIONAR
                        </Button>
                    </div>
                    <CustomizedTables tableHead={["PRODUTO", 'MARCA']} tableData={[{ produto: 'Folha de oficio', marca: 'HP' }, { produto: 'Caneta para quadro branco', marca: 'HP' }]} />

                    <TextField multiline rows={4} label="Descrição da solicitação" />

                    <div className="flex items-center">
                        <TextField type="number" label="Valor total" InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                        <DatePicker label="Vencimento" minDate={minDate} onChange={(_d, e) => setSelectedDate(_d)} />

                        <FormControl sx={{ m: 1, width: 300 }}>
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

                    <div className="flex items-center">
                        <Typography className="mr-10" color='GrayText'>Possui comprovante</Typography>
                        <FormGroup className="flex flex-row">
                            <FormControlLabel control={<Checkbox />} label="Sim" />
                            <FormControlLabel control={<Checkbox />} label="Não" />
                        </FormGroup>
                        <div>
                            <Input
                                accept="application/pdf"
                                id="file-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file-upload">
                                <Button
                                    sx={{ borderRadius: '7px' }}
                                    variant="outlined"
                                    component="span"
                                    endIcon={<FuseSvgIcon>heroicons-outline:upload</FuseSvgIcon>}
                                >
                                    ANEXAR DOCUMENTO
                                </Button>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Typography className="mr-10" color='GrayText'>Rateio</Typography>
                        <FormGroup className="flex flex-row">
                            <FormControlLabel control={<Checkbox />} label="Sim" />
                            <FormControlLabel control={<Checkbox />} label="Não" />
                        </FormGroup>
                    </div>
                    <div className="flex justify-end gap-10">

                        <Button variant="text" startIcon={<FuseSvgIcon>heroicons-outline:printer</FuseSvgIcon>}>IMPRIMIR</Button>
                        <Button sx={{ borderRadius: '7px' }} variant="outlined">CANCELAR</Button>
                        <Button sx={{ borderRadius: '7px' }} variant="contained">ENVIAR</Button>
                    </div>

                </Paper>

            </div>

        </Box>

    )
}
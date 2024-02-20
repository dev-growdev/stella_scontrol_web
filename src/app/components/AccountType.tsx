import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormDataProps } from '../main/form-request/FormRequest';

interface AccountTypeProps {
	formData: FormDataProps;
	handleChangeTypeAccount: (arg: SelectChangeEvent) => void;
}

export default function AccountType({ formData, handleChangeTypeAccount }: AccountTypeProps) {
	return (
		<>
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
									onChange={e => handleChangeTypeAccount(e)}
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
		</>
	);
}

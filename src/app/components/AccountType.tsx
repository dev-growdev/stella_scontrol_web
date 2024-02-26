import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { FormDataProps } from '../main/form-request/FormRequest';

interface AccountTypeProps {
	paymentMethod: string;
	accountType: string;
	control: Control<FormDataProps>;
	register: UseFormRegister<FormDataProps>;
}

export default function AccountType({ paymentMethod, accountType, control, register }: AccountTypeProps) {
	return (
		<>
			{paymentMethod === 'Pix' && <TextField label="Informe a chave pix" />}
			{paymentMethod === 'Transferência bancária' && (
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
							<Controller
								name="typeAccount"
								control={control}
								render={field => (
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">Tipo de conta</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={accountType}
											{...field}
											{...register('typeAccount')}
											label="Age"
										>
											<MenuItem value="Conta poupança">Conta poupança</MenuItem>
											<MenuItem value="Conta corrente">Conta corrente</MenuItem>
										</Select>
									</FormControl>
								)}
							/>
							<TextField
								fullWidth
								label="CPF ou CNPJ do Beneficiário"
							/>
						</div>
					</div>
				</div>
			)}
			{paymentMethod.includes('Cartão') && <TextField label="selecionar ao portador" />}
		</>
	);
}

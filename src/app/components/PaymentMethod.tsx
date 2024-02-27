import { FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormDataProps } from '../main/form-request/FormRequest';

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

interface PaymentMethod {
	paymentMethod: string;
	register: UseFormRegister<FormDataProps>;
	control: Control<FormDataProps>;
	errors: FieldErrors<FormDataProps>;
}

export default function PaymentMethod({ paymentMethod, register, control, errors }: PaymentMethod) {
	return (
		<Controller
			name="paymentMethod"
			control={control}
			render={field => (
				<FormControl
					className="w-full"
					error={!!errors.paymentMethod}
				>
					<InputLabel id="demo-multiple-name-label">Forma de pagamento</InputLabel>
					<Select
						{...field}
						labelId="demo-multiple-name-label"
						id="demo-multiple-name"
						value={paymentMethod}
						error={!!errors?.paymentMethod}
						input={
							<OutlinedInput
								{...register('paymentMethod')}
								label="Forma de pagamento"
							/>
						}
						MenuProps={MenuProps}
					>
						{paymentMethods.map(name => (
							<MenuItem
								key={name}
								value={name}
							>
								{name}
							</MenuItem>
						))}
					</Select>
					<FormHelperText error>{errors?.paymentMethod?.message}</FormHelperText>
				</FormControl>
			)}
		/>
	);
}

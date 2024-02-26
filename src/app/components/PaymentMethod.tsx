import { FormHelperText, InputLabel, OutlinedInput, Theme, useTheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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

interface PaymentMethodProps {
	paymentMethod: string;
	handleChangeSelect?: (e: SelectChangeEvent<string>) => void;
	handleChangeTypeAccount?: (e: SelectChangeEvent) => void;
	register: UseFormRegister<FormDataProps>;
	control: Control<FormDataProps>;
	errors: FieldErrors<FormDataProps>;
}

export default function PaymentMethod({
	paymentMethod,
	handleChangeSelect,
	handleChangeTypeAccount,
	register,
	control,
	errors
}: PaymentMethodProps) {
	const theme = useTheme();

	function getStyles(name: string, personName: string, theme: Theme) {
		return {
			fontWeight:
				personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
		};
	}

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
								style={getStyles(name, paymentMethod, theme)} // testar o que acontece se remover
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

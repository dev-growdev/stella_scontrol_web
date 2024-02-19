import { InputLabel, OutlinedInput, Theme, useTheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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
	formData: any;
	handleChangeSelect: (e: any) => void;
	handleChangeTypeAccount: (e: any) => void;
}

export default function PaymentMethod({ formData, handleChangeSelect, handleChangeTypeAccount }: PaymentMethodProps) {
	const theme = useTheme();

	function getStyles(name: string, personName: string[], theme: Theme) {
		return {
			fontWeight:
				personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
		};
	}

	return (
		<>
			<FormControl className="w-full">
				<InputLabel id="demo-multiple-name-label">Forma de pagamento</InputLabel>
				<Select
					labelId="demo-multiple-name-label"
					id="demo-multiple-name"
					value={formData.paymentMethod}
					onChange={e => handleChangeSelect(e)}
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
		</>
	);
}

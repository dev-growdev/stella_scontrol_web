import { InputAdornment, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

interface ValueAndDueDateProps {
	setFormData: (arg: any) => void;
	formData: any;
}

export default function ValueAndDueDate({ setFormData, formData }: ValueAndDueDateProps) {
	const currentDate = new Date();
	const minDate = new Date();
	minDate.setDate(currentDate.getDate() + 7);
	return (
		<div className="flex flex-col sm:flex-row items-center gap-24">
			<TextField
				onChange={e => setFormData(prevState => ({ ...prevState, totalValue: e.target.value }))}
				className="w-full"
				value={formData.totalValue}
				type="number"
				label="Valor"
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
		</div>
	);
}

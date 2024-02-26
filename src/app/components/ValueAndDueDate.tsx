import { InputAdornment, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { ChangeEvent } from 'react';

interface ValueAndDueDateProps {
	setFormDataValue: (arg: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	formData: { value: string; dueDate: Date | null };
	setFormDataDueDate: (arg: Date) => void;
}

export default function ValueAndDueDate({ setFormDataValue, formData, setFormDataDueDate }: ValueAndDueDateProps) {
	const currentDate = new Date();
	const minDate = new Date();
	minDate.setDate(currentDate.getDate() + 7);

	return (
		<div className="flex w-full flex-col sm:flex-row items-center gap-24">
			<TextField
				onChange={e => setFormDataValue(e)}
				className="w-full"
				value={formData.value}
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
					onChange={e => setFormDataDueDate(e)}
				/>
			</LocalizationProvider>
		</div>
	);
}

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

// import { Control, Controller, UseFormRegister } from 'react-hook-form';
// import { FormDataProps } from '../main/form-request/FormRequest';

// interface ValueAndDueDateProps {
// 	control: Control<FormDataProps>;
// 	defaultValueFromDatePicker: Date | null;
// 	labelValue: string;
// 	defaultValueFromValue: string;
// 	register: UseFormRegister<FormDataProps>;
// 	labelDatePicker: string;
// }

// export default function ValueAndDueDate({
// 	control,
// 	labelDatePicker,
// 	labelValue,
// 	defaultValueFromValue,
// 	register
// }: ValueAndDueDateProps) {
// 	const currentDate = new Date();
// 	const minDate = new Date();
// 	minDate.setDate(currentDate.getDate() + 7);
// 	return (
// 		<FormControl className="flex w-full flex-col sm:flex-row items-center gap-24">
// 			<Controller
// 				name="valueTest"
// 				control={control}
// 				defaultValue={defaultValueFromValue}
// 				render={({ field }) => (
// 					<TextField
// 						{...field}
// 						{...register('valueTest')}
// 						className="w-full"
// 						type="number"
// 						label={labelValue}
// 						InputProps={{
// 							startAdornment: <InputAdornment position="start">R$</InputAdornment>,
// 							sx: { height: '3.73em' }
// 						}}
// 					/>
// 				)}
// 			/>

// 			<Controller
// 				name="dateTest"
// 				control={control}
// 				defaultValue={null}
// 				render={({ field }) => (
// 					<LocalizationProvider
// 						dateAdapter={AdapterDateFns}
// 						adapterLocale={ptBR}
// 					>
// 						<DatePicker
// 							onChange={date => field.onChange(date)}
// 							className="w-full"
// 							label={labelDatePicker}
// 							minDate={minDate}
// 							format="dd/MM/yyyy"
// 						/>
// 					</LocalizationProvider>
// 				)}
// 			/>
// 		</FormControl>
// 	);
// }

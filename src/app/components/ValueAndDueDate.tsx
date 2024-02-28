import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { InputAdornment, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { Control, Controller, FieldErrors, UseFieldArrayRemove, UseFormRegister } from 'react-hook-form';
import { FormDataProps } from '../main/form-request/FormRequest';

interface ValueAndDueDateProps {
	control: Control<FormDataProps>;
	register: UseFormRegister<FormDataProps>;
	index: number;
	errors?: FieldErrors<FormDataProps>;
	remove: UseFieldArrayRemove;
}

export default function ValueAndDueDate({ control, register, index, errors, remove }: ValueAndDueDateProps) {
	const currentDate = new Date();
	const minDate = new Date();
	minDate.setDate(currentDate.getDate() + 7);

	return (
		<div className="flex flex-col w-full">
			<div className="flex w-full flex-col sm:flex-row justify-center items-center gap-24">
				<Controller
					name={`payments.${index}.value`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="w-full"
							error={!!errors.payments?.[index]?.value?.message}
							type="number"
							{...register(`payments.${index}.value`)}
							helperText={errors.payments?.[index]?.value?.message}
							label="Valor"
							InputProps={{
								startAdornment: <InputAdornment position="start">R$</InputAdornment>,
								sx: { height: '3.73em' }
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name={`payments.${index}.dueDate`}
					render={({ field }) => (
						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							adapterLocale={ptBR}
						>
							<DatePicker
								className="w-full"
								label="Vencimento"
								minDate={minDate}
								format="dd/MM/yyyy"
								onChange={field.onChange}
								{...field}
								slotProps={{
									textField: {
										helperText: errors?.payments?.[index]?.dueDate?.message,
										error: !!errors?.payments?.[index]?.dueDate?.message
									}
								}}
							/>
						</LocalizationProvider>
					)}
				/>
				<FuseSvgIcon
					onClick={() => remove(index)}
					color="primary"
				>
					heroicons-outline:trash
				</FuseSvgIcon>
			</div>
		</div>
	);
}

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { InputAdornment, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { Control, Controller, FieldErrors, UseFieldArrayRemove } from 'react-hook-form';
import { TPaymentRequestForm } from '../validations/paymentRequestForm.schema';

interface ValueAndDueDateProps {
	control: Control<TPaymentRequestForm>;
	index: number;
	errors?: FieldErrors<TPaymentRequestForm>;
	remove: UseFieldArrayRemove;
	readMode: boolean;
}

export function ValueAndDueDate({ control, index, errors, remove, readMode }: ValueAndDueDateProps) {
	const currentDate = new Date();
	const minDate = new Date();
	minDate.setDate(currentDate.getDate() + 7);

	return (
		<div className="flex flex-col w-full">
			<div className="flex relative w-full flex-col sm:flex-row justify-center items-center gap-24">
				<Controller
					control={control}
					name={`payments.${index}.value`}
					render={({ field }) => (
						<TextField
							className="w-full"
							sx={{
								'& .MuiFormHelperText-root': {
									position: 'absolute',
									top: '55px'
								}
							}}
							{...field}
							error={!!errors.payments?.[index]?.value?.message}
							helperText={errors.payments?.[index]?.value?.message}
							disabled={readMode}
							label="Valor"
							InputProps={{
								startAdornment: <InputAdornment position="start">R$</InputAdornment>,
								sx: {
									height: '3.73em'
								}
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
								disabled={readMode}
								minDate={minDate}
								format="dd/MM/yyyy"
								onChange={field.onChange}
								sx={{
									'& .MuiFormHelperText-root': {
										position: 'absolute',
										top: '55px'
									}
								}}
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
				{!readMode && (
					<FuseSvgIcon
						onClick={() => remove(index)}
						color="primary"
					>
						heroicons-outline:trash
					</FuseSvgIcon>
				)}
			</div>
		</div>
	);
}

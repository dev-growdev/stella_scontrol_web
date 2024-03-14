import { FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FormDataProps } from '../main/form-request/FormRequest';
import { PaymentForm, selectPaymentsForm } from '../main/payments-form/PaymentsFormSlice';

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

interface PaymentMethod {
	selectedPaymentMethod: string;
	register: UseFormRegister<FormDataProps>;
	control: Control<FormDataProps>;
	errors: FieldErrors<FormDataProps>;
}

export default function PaymentMethod({ selectedPaymentMethod, register, control, errors }: PaymentMethod) {
	const paymentsFormRedux = useSelector(selectPaymentsForm);
	const { paymentsForm } = paymentsFormRedux;

	const [payments, setPayments] = useState<PaymentForm[]>([]);

	useEffect(() => {
		let paymentsFormFiltered = paymentsForm.filter(holder => holder.type === '' && holder.enable);
		const creditPaymentsForm = paymentsForm.filter(holder => holder.type === 'credit' && holder.enable);
		const corporatePaymentsForm = paymentsForm.filter(holder => holder.type === 'corporate' && holder.enable);
		if (creditPaymentsForm.length === 0) {
			paymentsFormFiltered = paymentsFormFiltered.filter(payment => payment.name !== 'Cartão de crédito');
		}
		if (corporatePaymentsForm.length === 0) {
			paymentsFormFiltered = paymentsFormFiltered.filter(payment => payment.name !== 'Cartão corporativo');
		}
		setPayments(paymentsFormFiltered);
	}, [paymentsForm]);
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
						value={selectedPaymentMethod}
						error={!!errors?.paymentMethod}
						input={
							<OutlinedInput
								{...register('paymentMethod')}
								label="Forma de pagamento"
							/>
						}
						MenuProps={MenuProps}
					>
						{payments.map(item => (
							<MenuItem
								key={item.name}
								value={item.name}
							>
								{item.name}
							</MenuItem>
						))}
					</Select>
					<FormHelperText error>{errors.paymentMethod?.message}</FormHelperText>
				</FormControl>
			)}
		/>
	);
}

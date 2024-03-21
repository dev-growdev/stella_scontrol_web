import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { PaymentForm, selectPaymentsForm } from '~/modules/s-control/store/slices/PaymentsFormSlice';
import { TPaymentRequestForm } from '../validations/paymentRequestForm.schema';

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
	selectedPaymentMethod: { name?: string; uid?: string };
	setValue: UseFormSetValue<TPaymentRequestForm>;
	control: Control<TPaymentRequestForm>;
	errors: FieldErrors<TPaymentRequestForm>;
}

export function PaymentMethod({ selectedPaymentMethod, setValue, control, errors }: PaymentMethod) {
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

	function handleChangePaymentMethod(event: ChangeEvent<HTMLInputElement>) {
		const { value } = event.target;
		const findPaymentMethod = payments.find(payment => payment.name === value);
		const { name, uid } = findPaymentMethod;
		setValue('paymentMethod', { name, uid });
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
						value={selectedPaymentMethod.name}
						error={!!errors?.paymentMethod}
						onChange={handleChangePaymentMethod}
						input={<OutlinedInput label="Forma de pagamento" />}
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

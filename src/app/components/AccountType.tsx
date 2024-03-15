import { Autocomplete, FormHelperText, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { ChangeEvent, useEffect, useState } from 'react';
import {
	Control,
	Controller,
	FieldErrors,
	UseFormClearErrors,
	UseFormRegister,
	UseFormSetError,
	UseFormSetValue,
	UseFormUnregister
} from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FormDataType } from '../main/form-request/FormRequest';
import { HolderType, selectPaymentsForm } from '../main/payments-form/PaymentsFormSlice';

interface AccountTypeProps {
	paymentMethod: string;
	control: Control<FormDataType>;
	register: UseFormRegister<FormDataType>;
	setValue: UseFormSetValue<FormDataType>;
	unregister: UseFormUnregister<FormDataType>;
	errors: FieldErrors<FormDataType>;
	setError: UseFormSetError<FormDataType>;
	clearErrors: UseFormClearErrors<FormDataType>;
}

export default function AccountType({
	paymentMethod,
	control,
	register,
	setValue,
	unregister,
	errors,
	setError,
	clearErrors
}: AccountTypeProps) {
	const paymentsFormRedux = useSelector(selectPaymentsForm);
	const { paymentsForm } = paymentsFormRedux;
	const [creditCardHolders, setCreditCardHolders] = useState<HolderType[]>([]);
	const [corporateCardHolders, setCorporateCardHolders] = useState<HolderType[]>([]);

	useEffect(() => {
		if (paymentsForm && paymentsForm.length > 0) {
			const creditCardHolders = paymentsForm.filter(holder => holder.type === 'credit' && holder.enable === true);
			setCreditCardHolders(creditCardHolders as HolderType[]);

			const corporateCardHolders = paymentsForm.filter(
				holder => holder.type === 'corporate' && holder.enable === true
			);
			setCorporateCardHolders(corporateCardHolders as HolderType[]);
		}
	}, [paymentsForm]);

	useEffect(() => {
		if (paymentMethod === 'Pix') {
			unregister('bankTransfer');
			unregister('cardHolder');
		}
		if (paymentMethod.includes('crédito') || paymentMethod.includes('corporativo')) {
			unregister('bankTransfer');
			unregister('pix');
		}
		if (paymentMethod === 'Transferência bancária') {
			unregister('cardHolder');
			unregister('pix');
		}
	}, [paymentMethod]);

	function handleAutocomplete(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target.outerText) {
			setError('cardHolder.name', { message: 'É necessário adicionar um portador.' });
			return;
		}
		clearErrors('cardHolder');
		const { outerText } = event.target;
		setValue('cardHolder.name', outerText);

		const findHolder = paymentsForm.find(
			(item: HolderType) => item.name === outerText && item.namePaymentForm === paymentMethod
		);
		setValue('cardHolder.uid', findHolder.uid);
	}

	return (
		<>
			{paymentMethod === 'Pix' && (
				<TextField
					label="Informe a chave pix"
					{...register('pix')}
					error={!!errors.pix?.message}
					helperText={errors.pix?.message ?? ''}
				/>
			)}
			{paymentMethod === 'Transferência bancária' && (
				<div className="flex gap-24 justify-center">
					<div className="flex flex-col w-full gap-24">
						<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">
							<TextField
								fullWidth
								label="Banco"
								{...register('bankTransfer.bank')}
								error={!!errors.bankTransfer?.bank?.message}
								helperText={errors.bankTransfer?.bank?.message ?? ''}
							/>
							<TextField
								fullWidth
								label="Numero da conta"
								{...register('bankTransfer.accountNumber')}
								error={!!errors.bankTransfer?.accountNumber?.message}
								helperText={errors.bankTransfer?.accountNumber?.message ?? ''}
							/>
							<TextField
								fullWidth
								label="Agência"
								{...register('bankTransfer.agency')}
								error={!!errors.bankTransfer?.agency?.message}
								helperText={errors.bankTransfer?.agency?.message ?? ''}
							/>
						</div>
						<div className="flex gap-24">
							<Controller
								name="bankTransfer.accountType"
								control={control}
								render={field => (
									<FormControl fullWidth>
										<InputLabel
											error={!!errors.bankTransfer?.accountType?.message}
											id="demo-simple-select-label"
										>
											Tipo de conta
										</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											{...field}
											{...register('bankTransfer.accountType')}
											error={!!errors.bankTransfer?.accountType?.message}
											label="Age"
										>
											<MenuItem value="Conta poupança">Conta poupança</MenuItem>
											<MenuItem value="Conta corrente">Conta corrente</MenuItem>
										</Select>
										<FormHelperText error>
											{errors.bankTransfer?.accountType?.message ?? ''}
										</FormHelperText>
									</FormControl>
								)}
							/>
							<TextField
								fullWidth
								error={!!errors.bankTransfer?.cpfOrCnpj?.message}
								helperText={errors.bankTransfer?.cpfOrCnpj?.message ?? ''}
								label="CPF ou CNPJ do Beneficiário"
								{...register('bankTransfer.cpfOrCnpj')}
							/>
						</div>
					</div>
				</div>
			)}
			{paymentMethod.includes('crédito') && (
				<Controller
					control={control}
					name="cardHolder"
					render={({ field }) => (
						<Autocomplete
							id="credit-card-holder"
							onChange={handleAutocomplete}
							options={creditCardHolders.map(holder => holder.name)}
							renderInput={params => (
								<TextField
									{...field}
									{...params}
									error={!!errors.cardHolder?.name?.message}
									helperText={errors.cardHolder?.name?.message ?? ''}
									label="selecionar ao portador"
								/>
							)}
						/>
					)}
				/>
			)}
			{paymentMethod.includes('corporativo') && (
				<Controller
					control={control}
					name="cardHolder"
					render={({ field }) => (
						<Autocomplete
							id="corporate-card-holder"
							onChange={handleAutocomplete}
							options={corporateCardHolders.map(holder => holder.name)}
							renderInput={params => (
								<TextField
									{...field}
									{...params}
									error={!!errors.cardHolder?.name?.message}
									helperText={errors.cardHolder?.name?.message ?? ''}
									label="selecionar ao portador"
								/>
							)}
						/>
					)}
				/>
			)}
		</>
	);
}

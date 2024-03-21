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
import { HolderType, selectPaymentsForm } from '~/modules/s-control/store/slices/PaymentsFormSlice';
import { TPaymentRequestForm } from '../validations/paymentRequestForm.schema';

interface AccountTypeProps {
	paymentMethod: { name?: string; uid?: string };
	control: Control<TPaymentRequestForm>;
	register: UseFormRegister<TPaymentRequestForm>;
	setValue: UseFormSetValue<TPaymentRequestForm>;
	unregister: UseFormUnregister<TPaymentRequestForm>;
	errors: FieldErrors<TPaymentRequestForm>;
	setError: UseFormSetError<TPaymentRequestForm>;
	clearErrors: UseFormClearErrors<TPaymentRequestForm>;
}

export function AccountType({
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
	const [creditCardHoldersBB, setCreditCardHoldersBB] = useState<HolderType[]>([]);
	const [creditCardHoldersBRAD, setCreditCardHoldersBRAD] = useState<HolderType[]>([]);
	const [corporateCardHolders, setCorporateCardHolders] = useState<HolderType[]>([]);

	useEffect(() => {
		if (paymentsForm && paymentsForm.length > 0) {
			const bbCreditCardHolders = paymentsForm.filter(
				holder => holder.type === 'credit' && holder.enable === true && holder.namePaymentForm.includes('BB')
			);

			setCreditCardHoldersBB(bbCreditCardHolders as HolderType[]);

			const bradCreditCardHolders = paymentsForm.filter(
				holder => holder.type === 'credit' && holder.enable === true && holder.namePaymentForm.includes('BRAD')
			);
			setCreditCardHoldersBRAD(bradCreditCardHolders as HolderType[]);

			const corporateCardHolders = paymentsForm.filter(
				holder => holder.type === 'corporate' && holder.enable === true
			);
			setCorporateCardHolders(corporateCardHolders as HolderType[]);
		}
	}, [paymentsForm]);

	useEffect(() => {
		if (paymentMethod.name === 'Pix') {
			unregister('bankTransfer');
			unregister('cardHolder');
		}
		if (paymentMethod.name.includes('crédito') || paymentMethod.name.includes('corporativo')) {
			unregister('bankTransfer');
			unregister('pix');
		}
		if (paymentMethod.name === 'Transferência bancária') {
			unregister('cardHolder');
			unregister('pix');
		}
	}, [paymentMethod]);

	function handleAutocomplete(event: ChangeEvent<HTMLInputElement>) {
		const { outerText } = event.target;
		if (!outerText) {
			setError('cardHolder.name', { message: 'É necessário adicionar um portador.' });
			return;
		}

		clearErrors('cardHolder');

		setValue('cardHolder.name', outerText);

		const findHolder = paymentsForm.find(
			(item: HolderType) => outerText.includes(item.name) && item.namePaymentForm === paymentMethod.name
		);

		setValue('cardHolder.uid', findHolder.uid);
	}

	return (
		<>
			{paymentMethod.name === 'Pix' && (
				<TextField
					label="Informe a chave pix"
					{...register('pix')}
					error={!!errors.pix?.message}
					helperText={errors.pix?.message ?? ''}
				/>
			)}
			{paymentMethod.name === 'Transferência bancária' && (
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
											label="Tipo de conta"
											id="demo-simple-select"
											value={field.field.value}
											{...field}
											{...register('bankTransfer.accountType')}
											error={!!errors.bankTransfer?.accountType?.message}
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
			{paymentMethod.name === 'Cartão de crédito BB' && (
				<Controller
					control={control}
					name="cardHolder"
					render={({ field }) => (
						<Autocomplete
							id="credit-card-holder"
							onChange={handleAutocomplete}
							value={field.value}
							options={creditCardHoldersBB}
							getOptionLabel={(holder: HolderType) => `${holder.code} - ${holder.name}`}
							renderInput={params => (
								<TextField
									{...field}
									{...params}
									error={!!errors.cardHolder?.message}
									helperText={errors.cardHolder?.message ?? ''}
									label="Selecionar portador"
								/>
							)}
						/>
					)}
				/>
			)}
			{paymentMethod.name === 'Cartão de crédito BRAD' && (
				<Controller
					control={control}
					name="cardHolder"
					render={({ field }) => (
						<Autocomplete
							id="credit-card-holder"
							onChange={handleAutocomplete}
							value={field.value}
							options={creditCardHoldersBRAD}
							getOptionLabel={(holder: HolderType) => `${holder.code} - ${holder.name}`}
							renderInput={params => (
								<TextField
									{...field}
									{...params}
									error={!!errors.cardHolder?.message}
									helperText={errors.cardHolder?.message ?? ''}
									label="Selecionar portador"
								/>
							)}
						/>
					)}
				/>
			)}
			{paymentMethod.name.includes('corporativo') && (
				<Controller
					control={control}
					name="cardHolder"
					render={({ field }) => (
						<Autocomplete
							id="corporate-card-holder"
							onChange={handleAutocomplete}
							value={field.value}
							options={corporateCardHolders}
							getOptionLabel={(holder: HolderType) => `${holder.code} - ${holder.name}`}
							renderInput={params => (
								<TextField
									{...field}
									{...params}
									error={!!errors.cardHolder?.message}
									helperText={errors.cardHolder?.message ?? ''}
									label="Selecionar portador"
								/>
							)}
						/>
					)}
				/>
			)}
		</>
	);
}

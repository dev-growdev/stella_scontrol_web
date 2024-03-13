import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { ChangeEvent, useEffect, useState } from 'react';
import { Control, Controller, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FormDataProps } from '../main/form-request/FormRequest';
import { HolderType, selectPaymentsForm } from '../main/payments-form/PaymentsFormSlice';

interface AccountTypeProps {
	paymentMethod: string;
	accountType: string;
	control: Control<FormDataProps>;
	register: UseFormRegister<FormDataProps>;
	setValue: UseFormSetValue<FormDataProps>;
}

export default function AccountType({ paymentMethod, accountType, control, register, setValue }: AccountTypeProps) {
	const paymentsFormRedux = useSelector(selectPaymentsForm);
	const { paymentsForm } = paymentsFormRedux;
	const [creditCardHolders, setCreditCardHolders] = useState<HolderType[]>([]);
	const [corporateCardHolders, setCorporateCardHolders] = useState<HolderType[]>([]);

	useEffect(() => {
		if (paymentsForm && paymentsForm.length > 0) {
			const creditCardHolders = paymentsForm.filter(holder => holder.type === 'credit');
			setCreditCardHolders(creditCardHolders as HolderType[]);

			const corporatedCardHolders = paymentsForm.filter(holder => holder.type === 'corporate');
			setCorporateCardHolders(corporatedCardHolders as HolderType[]);
		}
	}, [paymentsForm]);

	function handleAutocomplete(event: ChangeEvent<HTMLInputElement>) {
		const { outerText } = event.target;
		setValue('cardHolder', outerText);
	}

	return (
		<>
			{paymentMethod === 'Pix' && <TextField label="Informe a chave pix" />}
			{paymentMethod === 'Transferência bancária' && (
				<div className="flex gap-24 justify-center">
					<div className="flex flex-col w-full gap-24">
						<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">
							<TextField
								fullWidth
								label="Banco"
							/>
							<TextField
								fullWidth
								label="Numero da conta"
							/>
							<TextField
								fullWidth
								label="Agência"
							/>
						</div>
						<div className="flex gap-24">
							<Controller
								name="typeAccount"
								control={control}
								render={field => (
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">Tipo de conta</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={accountType}
											{...field}
											{...register('typeAccount')}
											label="Age"
										>
											<MenuItem value="Conta poupança">Conta poupança</MenuItem>
											<MenuItem value="Conta corrente">Conta corrente</MenuItem>
										</Select>
									</FormControl>
								)}
							/>
							<TextField
								fullWidth
								label="CPF ou CNPJ do Beneficiário"
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
							id="combo-box-demo"
							onChange={handleAutocomplete}
							options={creditCardHolders.map(holder => holder.name)}
							renderInput={params => (
								<TextField
									{...field}
									{...params}
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
							id="combo-box-demo"
							onChange={handleAutocomplete}
							options={corporateCardHolders.map(holder => holder.name)}
							renderInput={params => (
								<TextField
									{...field}
									{...params}
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

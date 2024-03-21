import {
	Autocomplete,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	InputAdornment,
	TextField,
	Typography
} from '@mui/material';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, UseFieldArrayRemove, UseFormSetError, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useSelectorSControl } from '~/modules/s-control/store/hooks';
import { selectedCostCenters } from '~/modules/s-control/store/slices/costCenterSlice';
import { formattedNumeral } from '~/modules/s-control/utils/formatters/formatted-value';
import { TPaymentRequestForm } from '../../validations/paymentRequestForm.schema';
import { RateableTable } from './components';

interface PropsRateable {
	isRateable: boolean;
	setToggleRateable: (arg: boolean) => void;
	watch: UseFormWatch<TPaymentRequestForm>;
	setValue: UseFormSetValue<TPaymentRequestForm>;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<TPaymentRequestForm>;
	setError: UseFormSetError<TPaymentRequestForm>;
	totalApportionmentsValue: (value: number) => void;
	totalValue: number;
}

interface IAccountingAccount {
	id: number;
	name: string;
}

export function IsRateable({
	setError,
	isRateable,
	setToggleRateable,
	watch,
	setValue,
	remove,
	errors,
	totalApportionmentsValue,
	totalValue
}: PropsRateable) {
	const costCenters = useSelectorSControl(selectedCostCenters);
	const [accountingAccounts, setAccountingAccounts] = useState<IAccountingAccount[]>([]);
	const [costCenterId, setCostCenterId] = useState('');
	const [costCenterName, setCostCenterName] = useState<string | null>('');
	const [accountingAccountName, setAccountingAccountName] = useState<string | null>('');
	const [valueCostCenter, setValueCostCenter] = useState('');
	const [remainingValue, setRemainingValue] = useState(0);
	const [totalApportionmentsValueState, setTotalApportionmentsValueState] = useState(0);
	const [valueInputValue, setValueInputValue] = useState('');
	const formCostCenters = watch('apportionments');
	const [disableButtonAdd, setDisableButtonAdd] = useState(false);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (shouldDisableButtonAdd(totalApportionmentsValueState, totalValue)) {
			setDisableButtonAdd(true);
		} else {
			setDisableButtonAdd(false);
		}
	}, [totalApportionmentsValueState, totalValue]);

	const shouldDisableButtonAdd = (totalApportionmentsValueState: number, totalValue: number) => {
		return totalApportionmentsValueState === totalValue && totalApportionmentsValueState !== 0 && totalValue !== 0;
	};

	useEffect(() => {
		const remaining = totalValue - totalApportionmentsValueState;

		if (Number.isNaN(totalApportionmentsValueState)) {
			setRemainingValue(totalValue);
		}

		setRemainingValue(remaining);
	}, [totalValue, totalApportionmentsValueState]);

	useEffect(() => {
		if (remainingValue > 0 && formCostCenters.length > 0) {
			setValueInputValue(formattedNumeral(remainingValue));
			setValueCostCenter(formattedNumeral(remainingValue));
		}
		if (remainingValue === 0) {
			setValueInputValue('');
		}
	}, [remainingValue]);

	useEffect(() => {
		totalApportionmentsValue(totalApportionmentsValueState);
	}, [totalApportionmentsValueState]);

	useEffect(() => {
		async function getAccountingAccounts() {
			try {
				const res = await axios.get<{ data: IAccountingAccount[] }>(
					`${process.env.REACT_APP_API_URL}/budget-account/accounting-accounts/${costCenterId}`
				);
				const { data } = res.data;
				setAccountingAccounts(data);
			} catch (error) {
				dispatch(
					showMessage({
						message: 'Erro ao procurar contas contábeis. Atualize a página e tente novamente',
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'error'
					})
				);
			}
		}
		if (costCenterId !== '') {
			getAccountingAccounts();
		}
	}, [costCenterId]);

	useEffect(() => {
		if (!isRateable) {
			clearStates();
		}
	}, [isRateable]);

	const handleChangeCostCenter = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.outerText) {
			const findCostCenter = costCenters.costCenters.find(
				costCenter => costCenter.name === event.target.outerText
			);
			if (findCostCenter) {
				setCostCenterId(`${findCostCenter.id}`);
				setCostCenterName(findCostCenter.name);
			}
		} else {
			clearStates();
		}
	};
	const handleChangeAccountingAccount = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.outerText) {
			const findAccountingAccount = accountingAccounts.find(acc => acc.name === event.target.outerText);
			if (findAccountingAccount) {
				setAccountingAccountName(findAccountingAccount.name);
			}
		} else {
			clearStates();
		}
	};

	const handleValueCostCenter = (event: ChangeEvent<HTMLInputElement>) => {
		let { value } = event.target;
		value = value.replace(/[^\d,]/g, '');
		setValueCostCenter(value);
		setValueInputValue(value);
	};

	const handleSubmitApportionments = () => {
		if (costCenterName === '' || accountingAccountName === '') {
			return setError('apportionments', {
				message: 'É necessário adicionar todos os campos.'
			});
		}
		if (valueCostCenter === '' || valueCostCenter === '0' || valueCostCenter === ',') {
			return setError('apportionments', {
				message: 'É necessário adicionar um valor válido.'
			});
		}

		const validateIfValueExceeded = parseFloat(valueCostCenter.replace(',', '.')) + totalApportionmentsValueState;

		if (validateIfValueExceeded > totalValue) {
			return setError('apportionments', {
				message: 'O valor adicionado excedeu o valor total.'
			});
		}

		const setApportionments = {
			costCenter: costCenterName,
			accountingAccount: accountingAccountName,
			value: formattedNumeral(valueCostCenter)
		};

		const apportionments = watch('apportionments');
		if (apportionments) {
			const isDuplicated = apportionments.some(
				ap =>
					ap.costCenter === setApportionments.costCenter &&
					ap.accountingAccount === setApportionments.accountingAccount
			);
			if (isDuplicated) {
				return setError('apportionments', {
					message: 'Este centro de custo e conta contábil já foram adicionados.'
				});
			}
		}

		setValue('apportionments', [...apportionments, setApportionments]);
		return clearStates();
	};

	const clearStates = () => {
		setCostCenterId('');
		setValueCostCenter('');
		setCostCenterName('');
		setAccountingAccountName('');
		setAccountingAccounts([]);
		setRemainingValue(0);
	};

	return (
		<div className="flex flex-col">
			<div className="flex items-center">
				<Typography
					className="mr-10"
					color="GrayText"
				>
					Rateio
				</Typography>
				<FormGroup className="flex flex-row">
					<FormControlLabel
						control={
							<Checkbox
								onClick={() => setToggleRateable(true)}
								checked={isRateable}
								color="primary"
							/>
						}
						label="Sim"
					/>
					<FormControlLabel
						control={
							<Checkbox
								onClick={() => setToggleRateable(false)}
								checked={!isRateable}
								color="primary"
							/>
						}
						label="Não"
					/>
				</FormGroup>
			</div>
			{isRateable && (
				<>
					<div className="flex sm:flex-row flex-col gap-24 items-center">
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							options={costCenters.costCenters.map(costCenter => {
								return costCenter.name;
							})}
							value={costCenterName}
							noOptionsText="Adicione um centro de custo"
							className="w-full sm:w-1/3"
							onChange={handleChangeCostCenter}
							renderInput={params => (
								<TextField
									{...params}
									label="Centro de custo"
									error={!!errors?.apportionments?.message}
									helperText={errors?.apportionments?.message}
								/>
							)}
						/>
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							value={accountingAccountName}
							options={accountingAccounts.map(acc => {
								return acc.name;
							})}
							noOptionsText="É necessário adicionar um centro de custo antes."
							className="w-full sm:w-1/3"
							onChange={handleChangeAccountingAccount}
							renderInput={params => (
								<TextField
									{...params}
									label="Conta contábil"
									error={!!errors?.apportionments?.message}
									helperText={errors?.apportionments?.message}
								/>
							)}
						/>
						<TextField
							className="sm:w-1/3"
							label="Valor"
							type="text"
							value={valueInputValue}
							onChange={handleValueCostCenter}
							error={!!errors?.apportionments?.message}
							helperText={errors?.apportionments?.message}
							InputProps={{
								startAdornment: <InputAdornment position="start">R$</InputAdornment>,
								sx: {
									height: '3.73em'
								}
							}}
						/>

						<Button
							onClick={handleSubmitApportionments}
							variant="contained"
							disabled={disableButtonAdd}
						>
							Adicionar
						</Button>
					</div>

					<RateableTable
						remove={remove}
						totalApportionmentsValue={setTotalApportionmentsValueState}
						apportionments={formCostCenters}
					/>
				</>
			)}
		</div>
	);
}

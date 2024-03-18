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
import { selectedCostCenters } from 'app/store/cost-center/costCenterSlice';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, UseFieldArrayRemove, UseFormSetError, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FormDataType } from '../main/form-request/FormRequest';
import { formatedNumeral } from '../main/utils/formated-value';
import RatiableTable from './RatiableTable';

interface RatiableProps {
	isRatiable: boolean;
	setToggleRatiable: (arg: boolean) => void;
	watch: UseFormWatch<FormDataType>;
	setValue: UseFormSetValue<FormDataType>;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<FormDataType>;
	setError: UseFormSetError<FormDataType>;
	totalApportionmentsValue: (value: string) => void;
	totalValue: number;
}

interface AccountingAccountType {
	id: number;
	name: string;
}

export default function IsRatiable({
	setError,
	isRatiable,
	setToggleRatiable,
	watch,
	setValue,
	remove,
	errors,
	totalApportionmentsValue,
	totalValue
}: RatiableProps) {
	const costCentersRedux = useSelector(selectedCostCenters);
	const [accountingAccounts, setAccountingAccounts] = useState<AccountingAccountType[]>([]);
	const [costCenterId, setCostCenterId] = useState('');
	const [costCenterName, setCostCenterName] = useState<string | null>('');
	const [accountingAccountName, setAccountingAccountName] = useState<string | null>('');
	const [valueCostCenter, setValueCostCenter] = useState('');
	const [remainingValue, setRemainingValue] = useState(0);
	const [totalApportionmentsValueState, setTotalApportionmentsValueState] = useState(0);
	const [valueInputValue, setValueInputValue] = useState('');
	const formCostCenters = watch('apportionments');
	const [disableButtonAdd, setDisableButtonAdd] = useState(false);

	useEffect(() => {
		if (shouldDisableButtonAdd(totalApportionmentsValueState, totalValue)) {
			setDisableButtonAdd(true);
		} else {
			setDisableButtonAdd(false);
		}
	}, [totalApportionmentsValueState]);

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
			setValueInputValue(formatedNumeral(remainingValue));
			setValueCostCenter(formatedNumeral(remainingValue));
		}
		if (remainingValue === 0) {
			setValueInputValue('');
		}
	}, [remainingValue]);

	useEffect(() => {
		totalApportionmentsValue(formatedNumeral(totalApportionmentsValueState).toString());
	}, [totalApportionmentsValueState]);

	useEffect(() => {
		async function getAccountingAccounts() {
			const res = await axios.get<{ data: AccountingAccountType[] }>(
				`${process.env.REACT_APP_API_URL}/budget-account/accounting-accounts/${costCenterId}`
			);
			const { data } = res.data;
			if (data) {
				setAccountingAccounts(data);
			}
		}
		if (costCenterId !== '') {
			getAccountingAccounts();
		}
	}, [costCenterId]);

	useEffect(() => {
		if (!isRatiable) {
			clearStates();
		}
	}, [isRatiable]);

	const handleChangeCostCenter = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.outerText) {
			const findCostCenter = costCentersRedux.costCenters.find(
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
			return setError('apportionments', { message: 'É necessário adicionar todos os campos.' });
		}
		if (valueCostCenter === '' || valueCostCenter === '0' || valueCostCenter === ',') {
			return setError('apportionments', { message: 'É necessário adicionar um valor válido.' });
		}

		const validateIfValueExceeded = parseFloat(valueCostCenter.replace(',', '.')) + totalApportionmentsValueState;

		if (validateIfValueExceeded > totalValue) {
			return setError('apportionments', { message: 'O valor adicionado excedeu o valor total.' });
		}

		const setApportionments = {
			costCenter: costCenterName,
			accountingAccount: accountingAccountName,
			value: valueCostCenter
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
								onClick={() => setToggleRatiable(true)}
								checked={isRatiable}
								color="primary"
							/>
						}
						label="Sim"
					/>
					<FormControlLabel
						control={
							<Checkbox
								onClick={() => setToggleRatiable(false)}
								checked={!isRatiable}
								color="primary"
							/>
						}
						label="Não"
					/>
				</FormGroup>
			</div>
			{isRatiable && (
				<>
					<div className="flex sm:flex-row flex-col gap-24 items-center">
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							options={costCentersRedux.costCenters.map(costCenter => {
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

					<RatiableTable
						remove={remove}
						costCenters={formCostCenters}
						totalApportionmentsValue={setTotalApportionmentsValueState}
					/>
				</>
			)}
		</div>
	);
}

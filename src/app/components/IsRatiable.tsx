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
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FormDataProps } from '../main/form-request/FormRequest';
import RatiableTable from './RatiableTable';

interface RatiableProps {
	isRatiable: boolean;
	setToggleRatiable: (arg: boolean) => void;
	errors: FieldErrors<FormDataProps>;
	watch: UseFormWatch<FormDataProps>;
	setValue: UseFormSetValue<FormDataProps>;
}

interface AccountingAccountType {
	id: number;
	name: string;
}

export default function IsRatiable({ isRatiable, setToggleRatiable, watch, errors, setValue }: RatiableProps) {
	const costCentersRedux = useSelector(selectedCostCenters);
	const [accountingAccounts, setAccountingAccounts] = useState<AccountingAccountType[]>([]);
	const [costCenterId, setCostCenterId] = useState('');
	const [costCenterName, setCostCenterName] = useState('');
	const [accountingAccountId, setAccountingAccountId] = useState('');
	const [accountingAccountName, setAccountingAccountName] = useState('');
	const [valueCostCenter, setValueCostCenter] = useState('');
	const formCostCenters = watch('costCenters');

	useEffect(() => {
		setAccountingAccountId('');
		async function getAccountingAccounts() {
			const res = await axios.get<{ data: AccountingAccountType[] }>(
				`${process.env.REACT_APP_API_URL}/accounting-accounts/${costCenterId}`
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
		const findCostCenter = costCentersRedux.costCenters.find(
			costCenter => costCenter.name === event.target.outerText
		);
		setCostCenterId(`${findCostCenter.id}`);
		setCostCenterName(findCostCenter.name);
	};
	const handleChangeAccountingAccount = (event: ChangeEvent<HTMLInputElement>) => {
		const findAccountingAccount = accountingAccounts.find(acc => acc.name === event.target.outerText);

		setAccountingAccountId(`${findAccountingAccount.id}`);
		setAccountingAccountName(findAccountingAccount.name);
	};

	const handleValueCostCenter = (event: ChangeEvent<HTMLInputElement>) => {
		setValueCostCenter(event.target.value);
	};

	const handleSubmiCostsCenter = () => {
		const setCostCenter = {
			costCenter: costCenterName,
			accountingAccount: accountingAccountName,
			value: valueCostCenter
		};
		setValue('costCenters', [...watch('costCenters'), setCostCenter]);
		clearStates();
	};

	const clearStates = () => {
		setCostCenterId('');
		setAccountingAccountId('');
		setValueCostCenter('');
		setCostCenterName('');
		setAccountingAccountName('');
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
			{isRatiable ? (
				<>
					<div className="flex sm:flex-row flex-col gap-24 items-center">
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							options={costCentersRedux.costCenters.map(costCenter => {
								return costCenter.name;
							})}
							value={costCenterName}
							className="w-full sm:w-1/3"
							onChange={handleChangeCostCenter}
							renderInput={params => (
								<TextField
									{...params}
									label="Centro de custo"
									error={!!errors?.costCenters?.message}
									helperText={errors?.costCenters?.message}
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
									error={!!errors?.costCenters?.message}
									helperText={errors?.costCenters?.message}
								/>
							)}
						/>
						<TextField
							className="sm:w-1/3"
							label="Valor"
							type="number"
							value={valueCostCenter}
							onChange={handleValueCostCenter}
							error={!!errors?.costCenters?.message}
							helperText={errors?.costCenters?.message}
							InputProps={{
								startAdornment: <InputAdornment position="start">R$</InputAdornment>,
								sx: {
									height: '3.73em'
								}
							}}
						/>
						<Button
							onClick={handleSubmiCostsCenter}
							variant="contained"
						>
							Adicionar
						</Button>
					</div>

					<RatiableTable costCenters={formCostCenters} />
				</>
			) : (
				<Autocomplete
					disablePortal
					id="combo-box-demo"
					value={accountingAccountName}
					options={accountingAccounts.map(acc => {
						return acc.name;
					})}
					noOptionsText="Você não tem um centro de custo vinculado."
					className="sm:w-1/3"
					onChange={handleChangeAccountingAccount}
					renderInput={params => (
						<TextField
							{...params}
							label="Conta contábil"
							error={!!errors?.costCenters?.message}
							helperText={errors?.costCenters?.message}
						/>
					)}
				/>
			)}
		</div>
	);
}

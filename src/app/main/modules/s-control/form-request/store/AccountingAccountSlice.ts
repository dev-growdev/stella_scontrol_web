import { createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import axios from 'axios';
import { ReduxStateScontrol } from '../../store';

interface AccountingAccount {
	uid: string;
	name: string;
}

interface AccountingAccountType {
	accountingAccount: AccountingAccount[];
	loading: boolean;
}

export const getAccountingAccountByCostCenter = createAppAsyncThunk(
	'accounting-accounts/getAccountingAccountByCostCenter',
	async (costCenterId: number) => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/budget-account/accounting-accounts/${costCenterId}`
			);

			return response.data.data;
		} catch (error) {
			return error;
		}
	}
);

const initialState: AccountingAccountType = {
	accountingAccount: [],
	loading: false
};

const accountingAccountSlice = createSlice({
	name: 'accountingAccount',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(getAccountingAccountByCostCenter.pending, state => {
				state.loading = true;
			})
			.addCase(getAccountingAccountByCostCenter.fulfilled, (state, action) => {
				state.loading = false;
				state.accountingAccount = action.payload;
			});
	}
});

export default accountingAccountSlice.reducer;

export const selectAccountingAccount = ({ scontrol }: ReduxStateScontrol) => scontrol.accountingAccount;

export type accountingAccountSliceType = typeof accountingAccountSlice;

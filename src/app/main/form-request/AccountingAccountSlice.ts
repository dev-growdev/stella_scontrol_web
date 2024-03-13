import { createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { RootStateType } from 'app/store/types';
import axios from 'axios';

type AppRootStateType = RootStateType<accountingAcoountSliceType>;

export interface AccountingAccount {
	uid: string;
	name: string;
}

export interface AccountingAccountType {
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

const accountingAcoountSlice = createSlice({
	name: 'accountingAcoount',
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

export default accountingAcoountSlice.reducer;

export const selectAccountingAccount = (state: AppRootStateType) => state.accountingAcoount;

export type accountingAcoountSliceType = typeof accountingAcoountSlice;

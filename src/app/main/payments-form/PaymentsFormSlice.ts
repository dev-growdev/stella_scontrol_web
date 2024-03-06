import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import axios from 'axios';
import { CardHolder } from './CardHoldersSlice';

type AppRootStateType = RootStateType<paymentsFormSliceType>;

export interface PaymentsFormType {
	loading: boolean;
	paymentsForm: PaymentForm[];
}

export interface PaymentForm {
	uid: string;
	name: string;
	enable: boolean;
	cardHolders: CardHolder[];
}

export const getPaymentsForm = createAsyncThunk('payments-form/getPaymentsForm', async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API_URL}/payments-form`);

		return response.data.data;
	} catch (error) {
		return error;
	}
});

export const disablePaymentsForm = createAsyncThunk('payments-form/disablePaymentsForm', async (data: PaymentForm) => {
	try {
		const body = {
			uid: data.uid,
			name: data.name,
			enable: data.enable
		};

		const response = await axios.put(`${process.env.REACT_APP_API_URL}/payments-form/${data.uid}`, body);

		return response.data.data;
	} catch (error) {
		return error;
	}
});

const initialState: PaymentsFormType = {
	loading: false,
	paymentsForm: []
};

const paymentsFormSlice = createSlice({
	name: 'paymentsForm',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(getPaymentsForm.pending, state => {
				state.loading = true;
			})
			.addCase(getPaymentsForm.fulfilled, (state, action) => {
				state.loading = false;
				state.paymentsForm = action.payload;
			})
			.addCase(disablePaymentsForm.pending, state => {
				state.loading = true;
			})
			.addCase(disablePaymentsForm.fulfilled, (state, action) => {
				state.loading = false;
				const indexUpdated = state.paymentsForm.findIndex(item => action.payload.uid === item.uid);
				if (indexUpdated !== -1) {
					state.paymentsForm[indexUpdated] = action.payload;
				}
			});
	}
});

export const selectPaymentsForm = (state: AppRootStateType) => state.paymentsForm;

export type paymentsFormSliceType = typeof paymentsFormSlice;

export default paymentsFormSlice.reducer;

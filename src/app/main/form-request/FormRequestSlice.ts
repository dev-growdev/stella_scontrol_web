import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import axios from 'axios';

type AppRootStateType = RootStateType<requestPaymentGeneralSliceType>;

interface RequestsType {
	uid: string;
	description?: string;
	sendReceipt: boolean;
	totalRequestValue: number;
	dueDate: Date;
}

interface RequestPaymentGeneralType {
	loading: boolean;
	requests: RequestsType[];
}

export interface createRequestGeneral {
	description: string;
	sendReceipt: boolean;
	totalRequestValue: number;
	dueDate: Date;
}

export const createRequestPaymentGeneral = createAsyncThunk(
	'requestPaymentGeneral/create',
	async (data: createRequestGeneral) => {
		try {
			const response = await axios.post(`${process.env.REACT_APP_API_URL}/payment-request-general`, data);
			if (response.data.code === 201) {
				return response.data.data;
			}
		} catch (error) {
			console.log(error.response, '---');
			throw new Error(error.response.data.message);
		}
	}
);

const initialState: RequestPaymentGeneralType = {
	loading: false,
	requests: []
};

const requestPaymentGeneralSlice = createSlice({
	name: 'requestPaymentGeneral',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(createRequestPaymentGeneral.pending, state => {
				state.loading = true;
			})
			.addCase(createRequestPaymentGeneral.fulfilled, (state, action) => {
				state.loading = false;

				action.payload && state.requests.push(action.payload);
			});
	}
});

export default requestPaymentGeneralSlice.reducer;
export const selectedRequestPaymentGeneral = (state: AppRootStateType) => state.requestPaymentGeneral;

export type requestPaymentGeneralSliceType = typeof requestPaymentGeneralSlice;

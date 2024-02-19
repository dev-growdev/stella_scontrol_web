import { createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { showMessage } from 'app/store/fuse/messageSlice';
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

export const createRequestPaymentGeneral = createAppAsyncThunk(
	'requestPaymentGeneral/create',
	async (data: createRequestGeneral, { dispatch }) => {
		try {
			const response = await axios.post(`${process.env.REACT_APP_API_URL}/payment-request-general`, data);
			if (response.data.code === 201) {
				dispatch(
					showMessage({
						message: 'Solicitação enviada com sucesso.',
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					})
				);
				return response.data.data;
			}
		} catch (error) {
			dispatch(
				showMessage({
					message: `${error.response.data.message}`,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);
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

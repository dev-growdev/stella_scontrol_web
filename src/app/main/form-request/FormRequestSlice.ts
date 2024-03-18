import { createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { showMessage } from 'app/store/fuse/messageSlice';
import { RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';

type AppRootStateType = RootStateType<requestPaymentGeneralSliceType>;

interface Payment {
	value: string;
	dueDate: Date;
}

interface Files {
	uid: string;
	name: string;
	key: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface RequestType {
	uid: string;
	supplier: string;
	description?: string;
	sendReceipt: boolean;
	totalValue: string;
	accountingAccout: string;
	payments: Payment[];
	createdAt: Date;
	files: Files[];
}

interface RequestPaymentGeneralType {
	loading: boolean;
	requests: RequestType[];
}

export interface CreateRequestGeneral {
	supplier: string;
	description: string;
	requiredReceipt: boolean;
	uploadedFiles: File[];
	totalValue: string;
	accountingAccout: string;
	payments: Payment[];
}

export const createRequestPaymentGeneral = createAppAsyncThunk(
	'requestPaymentGeneral/create',
	async (data: FormData, { dispatch }) => {
		try {
			const response = await axios.post<{
				code: number;
				success: boolean;
				data: { request: RequestType };
			}>(`${process.env.REACT_APP_API_URL}/payment-request-general`, data, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});

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
				return response.data.data.request;
			}
			throw new Error('Algo deu errado, tente novamente.');
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>;
			dispatch(
				showMessage({
					message: `${axiosError.response?.data.message}`,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);
			throw new Error(axiosError.response?.data.message);
		}
	}
);

export const listRequestsPaymentsByUser = createAppAsyncThunk('requestPaymentGeneral/get', async (userUid: string) => {
	try {
		const response = await axios.get<{
			code: number;
			success: boolean;
			data: RequestType[];
		}>(`${process.env.REACT_APP_API_URL}/payment-request-general/${userUid}`);
		const { data } = response.data;

		return data;
	} catch (error) {
		const axiosError = error as AxiosError<{ message: string }>;
		throw new Error(axiosError.response?.data.message);
	}
});

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
				if (action.payload) {
					state.requests.push(action.payload);
				}
			})
			.addCase(listRequestsPaymentsByUser.pending, state => {
				state.loading = true;
			})
			.addCase(listRequestsPaymentsByUser.fulfilled, (state, action) => {
				state.loading = false;
				if (action.payload) {
					state.requests = action.payload;
				}
			});
	}
});

export default requestPaymentGeneralSlice.reducer;
export const selectedRequestPaymentGeneral = (state: AppRootStateType) => state.requestPaymentGeneral;

export type requestPaymentGeneralSliceType = typeof requestPaymentGeneralSlice;

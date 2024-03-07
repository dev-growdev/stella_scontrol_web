import { createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { showMessage } from 'app/store/fuse/messageSlice';
import { RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';

type AppRootStateType = RootStateType<requestPaymentGeneralSliceType>;

interface RequestsType {
	uid: string;
	supplier: string;
	description?: string;
	sendReceipt: boolean;
	payments: { value: string; dueDate: Date }[];
}

interface RequestPaymentGeneralType {
	loading: boolean;
	requests: RequestsType[];
}

export interface createRequestGeneral {
	supplier: string;
	description: string;
	requiredReceipt: boolean;
	payments: { value: string; dueDate: Date }[];
	uploadedFiles: File[];
}

export const createRequestPaymentGeneral = createAppAsyncThunk(
	'requestPaymentGeneral/create',
	async (data: FormData, { dispatch }) => {
		try {
			const response = await axios.post<{
				code: number;
				success: boolean;
				data: { request: RequestsType };
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

export const findSupplierByCPForCNPJ = createAppAsyncThunk('/supplier/', async (cpfOrCnpj: string) => {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API_URL}/supplier/${cpfOrCnpj}`);

		return response.data.data;
	} catch (error) {
		throw new Error(error.response.data.message);
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

				action.payload && state.requests.push(action.payload);
			})
			.addCase(findSupplierByCPForCNPJ.pending, state => {
				state.loading = true;
			})
			.addCase(findSupplierByCPForCNPJ.fulfilled, (state, action) => {
				state.loading = false;
				action.payload && state.requests.push(action.payload);
			});
	}
});

export default requestPaymentGeneralSlice.reducer;
export const selectedRequestPaymentGeneral = (state: AppRootStateType) => state.requestPaymentGeneral;

export type requestPaymentGeneralSliceType = typeof requestPaymentGeneralSlice;

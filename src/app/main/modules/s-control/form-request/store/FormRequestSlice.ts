import { createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios, { AxiosError } from 'axios';
import { ReduxStateScontrol } from '../../store';
import { RequestPaymentGeneralType, RequestType } from '../entities/request';

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
			data: { request: RequestType }[];
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
export const selectedRequestPaymentGeneral = (state: ReduxStateScontrol) => state.scontrol.requestPaymentGeneral;

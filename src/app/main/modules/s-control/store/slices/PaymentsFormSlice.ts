import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ReduxStateScontrol } from '..';

export interface PaymentsFormType {
	loading: boolean;
	paymentsForm: PaymentForm[] | HolderType[];
}

export interface PaymentForm {
	uid: string;
	name: string;
	enable: boolean;
	type: string;
}
export interface HolderType {
	uid: string;
	name: string;
	enable: boolean;
	type: string;
	namePaymentForm: string;
	uidPaymentForm: string;
}

interface DataType {
	uid: string;
	name: string;
	enable: boolean;
	type: string;
	paymentForm?: {
		name: string;
		uid: string;
	};
}

interface ResponseDataType {
	success: boolean;
	code: number;
	data: DataType | DataType[];
}

export const getPaymentsForm = createAsyncThunk('payments-form/getPaymentsForm', async () => {
	try {
		const response = await axios.get<ResponseDataType>(`${process.env.REACT_APP_API_URL}/payments-form`);

		const { data } = response.data;

		const converted =
			Array.isArray(data) &&
			data.map(item =>
				item.paymentForm
					? {
							uid: item.uid,
							name: item.name,
							enable: item.enable,
							type: item.type,
							namePaymentForm: item.paymentForm.name,
							uidPaymentForm: item.paymentForm.uid
					  }
					: { uid: item.uid, name: item.name, enable: item.enable, type: '' }
			);

		return converted;
	} catch (error) {
		const axiosError = error as AxiosError<{ message: string }>;
		throw new Error(axiosError.response?.data.message);
	}
});

export const disablePaymentsForm = createAsyncThunk(
	'payments-form/disablePaymentsForm',
	async (dataToUpdate: PaymentForm | HolderType) => {
		try {
			const response = await axios.put<ResponseDataType>(
				`${process.env.REACT_APP_API_URL}/payments-form/${dataToUpdate.uid}`
			);

			const { data } = response.data;

			if (!Array.isArray(data)) {
				if (data.type) {
					return {
						uid: data.uid,
						name: data.name,
						enable: data.enable,
						type: data.type,
						namePaymentForm: data.paymentForm.name,
						uidPaymentForm: data.paymentForm.uid
					};
				}

				return {
					uid: data.uid,
					name: data.name,
					enable: data.enable,
					type: ''
				};
			}
			throw new Error('Não foi possível desabilitar.');
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>;
			throw new Error(axiosError.response?.data.message);
		}
	}
);

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
				if (action.payload) {
					state.paymentsForm = action.payload;
				}
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

export const selectPaymentsForm = ({ scontrol }: ReduxStateScontrol) => scontrol.paymentsForm;

export default paymentsFormSlice.reducer;

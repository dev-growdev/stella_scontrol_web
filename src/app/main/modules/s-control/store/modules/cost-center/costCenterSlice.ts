import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ReduxStateScontrol } from '../..';

interface CostCenter {
	id: number;
	name: string;
}

interface CostCenterSlice {
	loading: boolean;
	costCenters: CostCenter[];
}

interface ResponseApi {
	success: boolean;
	code: number;
	data: CostCenter[];
}

export const getCostCenters = createAsyncThunk('costCenters/getCostCenters', async () => {
	try {
		const response = await axios.get<ResponseApi>(`${process.env.REACT_APP_API_URL}/budget-account/cost-centers`);

		return response.data.data;
	} catch (error) {
		const axiosError = error as AxiosError<{ message: string }>;
		throw new Error(axiosError.response?.data.message);
	}
});

const initialState: CostCenterSlice = {
	loading: false,
	costCenters: []
};

const costCentersSlice = createSlice({
	name: 'costCenter',
	initialState,
	reducers: {},
	extraReducers: builder =>
		builder
			.addCase(getCostCenters.pending, state => {
				state.loading = true;
			})
			.addCase(getCostCenters.fulfilled, (state, action) => {
				state.loading = false;
				if (action.payload) {
					state.costCenters = action.payload;
				}
			})
});

export default costCentersSlice.reducer;
export const selectedCostCenters = (state: ReduxStateScontrol) => state.costCenter;

export type costCenterSliceType = typeof costCentersSlice;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import axios from 'axios';

type AppRootStateType = RootStateType<cardHoldersSliceType>;

export interface CardHoldersType {
	loading: boolean;
	cardHolders: CardHolder[];
}

export interface CardHolder {
	uid: string;
	name: string;
	type: 'credit' | 'corporate';
}

export const getCardHolders = createAsyncThunk('card-holders/getCardHolders', async (data: CardHolder) => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API_URL}/card-holders/${data.type}`);

		return response.data.data;
	} catch (error) {
		return error;
	}
});

const initialState: CardHoldersType = {
	loading: false,
	cardHolders: []
};

const cardHoldersSlice = createSlice({
	name: 'cardHolders',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(getCardHolders.pending, state => {
				state.loading = true;
			})
			.addCase(getCardHolders.fulfilled, (state, action) => {
				state.loading = false;
				state.paymentsForm = action.payload;
			});
	}
});

export const selectCardHolders = (state: AppRootStateType) => state.cardHolders;

export type cardHoldersSliceType = typeof cardHoldersSlice;

export default cardHoldersSlice.reducer;

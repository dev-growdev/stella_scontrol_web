import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import axios from 'axios';

type AppRootStateType = RootStateType<categorySliceType>;

export interface Category {
	uid: string;
	name: string;
	enable: boolean;
	action?: string;
}

export interface CategoriesType {
	categories: Category[];
	loading: boolean;
}

interface createCategory {
	name: string;
	enable: boolean;
}

export const createCategory = createAsyncThunk('categories/createCategory', async (data: createCategory) => {
	try {
		const response = await axios.post<{ data: Category }>(`${process.env.REACT_APP_API_URL}/categories`, data);

		return {
			uid: response.data.data.uid,
			name: response.data.data.name,
			enable: response.data.data.enable,
			action: ''
		};
	} catch (error) {
		throw error;
	}
});

export const getCategories = createAsyncThunk('categories/getCategories', async () => {
	try {
		const response = await axios.get<{ data: Category[] }>(`${process.env.REACT_APP_API_URL}/categories`);

		return response.data.data;
	} catch (error) {
		throw error;
	}
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async (data: Category) => {
	try {
		const body = {
			name: data.name,
			enable: data.enable
		};
		const response = await axios.put<{ data: Category }>(
			`${process.env.REACT_APP_API_URL}/categories/${data.uid}`,
			body
		);
		return response.data.data;
	} catch (error) {
		throw error;
	}
});

export const disableCategory = createAsyncThunk('categories/disableCategory', async (data: Category) => {
	try {
		const body = {
			name: data.name,
			enable: data.enable
		};
		const response = await axios.put<{ data: Category }>(
			`${process.env.REACT_APP_API_URL}/categories/${data.uid}/disable`,
			body
		);
		return response.data.data;
	} catch (error) {
		throw error;
	}
});

const initialState: CategoriesType = {
	categories: [],
	loading: false
};

const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(createCategory.pending, state => {
				state.loading = true;
			})
			.addCase(createCategory.fulfilled, (state, action) => {
				state.loading = false;
				state.categories.push(action.payload);
			})
			.addCase(getCategories.pending, state => {
				state.loading = true;
			})
			.addCase(getCategories.fulfilled, (state, action) => {
				state.loading = false;
				state.categories = action.payload;
			})
			.addCase(updateCategory.pending, state => {
				state.loading = true;
			})
			.addCase(updateCategory.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.categories.findIndex(category => category.uid === action.payload.uid);
				if (index !== -1) {
					state.categories[index] = action.payload;
				}
			})
			.addCase(disableCategory.pending, state => {
				state.loading = true;
			})
			.addCase(disableCategory.fulfilled, (state, action) => {
				state.loading = false;
				const indexUpdated = state.categories.findIndex(item => action.payload.uid === item.uid);
				if (indexUpdated !== -1) {
					state.categories[indexUpdated] = action.payload;
				}
			});
	}
});

export default categoriesSlice.reducer;
export const selectCategories = (state: AppRootStateType) => state.categories;

export type categorySliceType = typeof categoriesSlice;

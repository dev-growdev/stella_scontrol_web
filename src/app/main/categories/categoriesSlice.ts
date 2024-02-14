import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import axios from 'axios';

type AppRootStateType = RootStateType<categorySliceType>;

export interface Category {
	uid: string;
	name: string;
	createdAt: Date;
	enable: boolean;
	action: string;
}

interface CategoriesType {
	categories: Category[];
	loading: boolean;
}

interface createCategory {
	name: string;
	enable: boolean;
}

export const createCategory = createAsyncThunk('categories/create', async (data: createCategory) => {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API_URL}/categories`, data);

		return {
			uid: response.data.data.uid,
			name: response.data.data.name,
			createdAt: response.data.data.createdAt,
			enable: response.data.data.enable,
			action: ''
		};
	} catch (error) {
		console.error(error);
		return initialState.categories[0];
	}
});

export const getCategories = createAsyncThunk('categories/getCategories', async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);

		return response.data.data;
	} catch (error) {
		return initialState;
	}
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async (data: Category) => {
	try {
		const body = {
			name: data.name,
			enable: data.enable
		};
		const response = await axios.put(`${process.env.REACT_APP_API_URL}/categories/${data.uid}`, body);
		return response.data.data;
	} catch (error) {
		//analisar refatoração
		return initialState;
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
				state.categories.push(action.payload);
				state.loading = false;
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
				// Encontrar o índice do item a ser atualizado no array de categorias
				const index = state.categories.findIndex(cat => cat.uid === action.payload.uid);
				// Atualizar o item no array
				if (index !== -1) {
					state.categories[index] = action.payload;
				}
			});
	}
});

export default categoriesSlice.reducer;
export const selectCategories = (state: AppRootStateType) => state.categories;

export type categorySliceType = typeof categoriesSlice;

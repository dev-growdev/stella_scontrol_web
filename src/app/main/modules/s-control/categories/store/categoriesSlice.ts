import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import { ReduxStateScontrol } from '../../store';
import { CategoriesType, CategoryType } from '../entities/category';

interface createCategory {
	name: string;
	enable: boolean;
}

export const createCategory = createAppAsyncThunk(
	'categories/createCategory',
	async (data: createCategory, { dispatch }) => {
		try {
			if (data.name === '') {
				dispatch(
					showMessage({
						message: `Digite um nome para ser adicionado.`,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'warning'
					})
				);
			}
			const response = await axios.post<{ data: CategoryType }>(
				`${process.env.REACT_APP_API_URL}/categories`,
				data
			);

			dispatch(
				showMessage({
					message: `Categoria cadastrada com sucesso.`,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);

			return {
				uid: response.data.data.uid,
				name: response.data.data.name,
				enable: response.data.data.enable,
				action: ''
			};
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
			throw error;
		}
	}
);

export const getCategories = createAsyncThunk('categories/getCategories', async () => {
	const response = await axios.get<{ data: CategoryType[] }>(`${process.env.REACT_APP_API_URL}/categories`);

	return response.data.data;
});

export const updateCategory = createAppAsyncThunk(
	'categories/updateCategory',
	async (data: CategoryType, { dispatch }) => {
		try {
			const body = {
				name: data.name,
				enable: data.enable
			};
			const response = await axios.put<{ data: CategoryType }>(
				`${process.env.REACT_APP_API_URL}/categories/${data.uid}`,
				body
			);

			dispatch(
				showMessage({
					message: `Categoria atualizada com sucesso.`,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);

			return response.data.data;
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
			throw error;
		}
	}
);

export const disableCategory = createAsyncThunk('categories/disableCategory', async (data: CategoryType) => {
	const body = {
		name: data.name,
		enable: data.enable
	};
	const response = await axios.put<{ data: CategoryType }>(
		`${process.env.REACT_APP_API_URL}/categories/${data.uid}/disable`,
		body
	);
	return response.data.data;
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
			.addCase(createCategory.rejected, state => {
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
				const index = state.categories.findIndex(category => category.uid === action.payload.uid);
				if (index !== -1) {
					state.categories[index] = action.payload;
				}
			})
			.addCase(updateCategory.rejected, state => {
				state.loading = false;
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
export const selectCategories = (state: ReduxStateScontrol) => state.categories;

export type categorySliceType = typeof categoriesSlice;

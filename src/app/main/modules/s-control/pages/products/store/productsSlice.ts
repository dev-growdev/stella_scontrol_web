import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import { CreateProductType, FormProductType, ProductsType } from '../types/product';
import { ReduxStateScontrol } from '~/modules/s-control/store';

export const createProduct = createAppAsyncThunk(
	'products/createProduct',
	async (data: CreateProductType, { dispatch }) => {
		try {
			const response = await axios.post(`${process.env.REACT_APP_API_URL}/products`, data);

			dispatch(
				showMessage({
					message: 'Produto cadastrado com sucesso',
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
					message: error.response.data.message,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);

			return error;
		}
	}
);

export const getProducts = createAsyncThunk('products/getProducts', async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);

		return response.data.data;
	} catch (error) {
		return error;
	}
});

export const updateProduct = createAppAsyncThunk(
	'products/updateProduct',
	async (data: FormProductType, { dispatch }) => {
		try {
			const body = {
				categoryId: data.category,
				code: data.code,
				name: data.name,
				enable: data.enable,
				measurement: data.measurement,
				quantity: data.quantity
			};

			const response = await axios.put(`${process.env.REACT_APP_API_URL}/products/${data.uid}`, body);

			dispatch(
				showMessage({
					message: 'Produto editado com sucesso.',
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);

			return response.data;
		} catch (error) {
			dispatch(
				showMessage({
					message: error.response.data.message,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);
			return error;
		}
	}
);

export const disableProduct = createAsyncThunk('products/disableProduct', async (data: FormProductType) => {
	try {
		const body = {
			categoryId: data.category,
			name: data.name,
			enable: data.enable,
			measurement: data.measurement,
			quantity: data.quantity
		};

		const response = await axios.put(`${process.env.REACT_APP_API_URL}/products/${data.uid}/disable`, body);

		return response.data.data;
	} catch (error) {
		return error;
	}
});

const initialState: ProductsType = {
	products: [],
	loading: false
};

const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(createProduct.pending, state => {
				state.loading = true;
			})
			.addCase(createProduct.fulfilled, (state, action) => {
				if (action.payload !== undefined) {
					state.products.push(action.payload);
				}
				state.loading = false;
			})
			.addCase(getProducts.pending, state => {
				state.loading = true;
			})
			.addCase(getProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.products = action.payload;
			})
			.addCase(disableProduct.pending, state => {
				state.loading = true;
			})
			.addCase(disableProduct.fulfilled, (state, action) => {
				state.loading = false;
				const indexUpdated = state.products.findIndex(item => action.payload.uid === item.uid);
				if (indexUpdated !== -1) {
					state.products[indexUpdated] = action.payload;
				}
			});
	}
});

export const selectProducts = ({ scontrol }: ReduxStateScontrol) => scontrol.products;

export default productsSlice.reducer;

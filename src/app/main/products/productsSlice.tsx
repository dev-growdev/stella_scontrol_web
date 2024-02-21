import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import axios from 'axios';

type AppRootStateType = RootStateType<productSliceType>;

export interface Product {
	uid: string;
	category: { uid: string; name: string; enable: boolean };
	code: string;
	name: string;
	enable: boolean;
	measurement: string;
	quantity: number;
}

export interface ProductsType {
	products: Product[];
	loading: boolean;
}

export interface CreateProduct {
	categoryId: string;
	code: string;
	name: string;
	enable: boolean;
	measurement?: string;
	quantity?: number;
}

export const createProduct = createAsyncThunk('products/createProduct', async (data: CreateProduct) => {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API_URL}/products`, data);

		return response;
	} catch (error) {
		return error;
	}
});

export const getProducts = createAsyncThunk('products/getProducts', async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);

		return response.data.data;
	} catch (error) {
		return error;
	}
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (data: Product) => {
	try {
		const body = {
			category: data.categoryId,
			code: data.code,
			name: data.name,
			enable: data.enable,
			measurement: data.measurement,
			quantity: data.quantity
		};

		const response = await axios.put(`${process.env.REACT_APP_API_URL}/products/${data.uid}`, body);

		return response.data;
	} catch (error) {
		return error;
	}
});

export const disableProduct = createAsyncThunk('products/disableProduct', async (data: Product) => {
	try {
		const body = {
			categoryId: data.categoryId,
			code: data.code,
			name: data.name,
			enable: data.enable,
			measurement: data.measurement,
			quantity: data.quantity
		};

		const response = await axios.put(`${process.env.REACT_APP_API_URL}/products/${data.uid}/disable`, body);

		return response.data;
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
			});
	}
});

export const selectProducts = (state: AppRootStateType) => state.products;

export type productSliceType = typeof productsSlice;

export default productsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import { ISupplier } from '../types/supplier';
import { ReduxStateSquality } from '~/modules/s-quality/store';

export const createSupplier = createAppAsyncThunk(
  '/squality/fornecedores/cadastro',
  async (data: ISupplier, { dispatch }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/squality/suppliers`, data);

      dispatch(
        showMessage({
          message: 'Supplier successfully registered',
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

const initialState: { data: ISupplier[]; loading: boolean } = {
  data: [],
  loading: false
};

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createSupplier.pending, state => {
        state.loading = true;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        if (action.payload !== undefined) {
          state.data.push(action.payload);
        }
        state.loading = false;
      });
  }
});

export const selectSuppliers = ({ squality }: ReduxStateSquality) => squality.suppliers;
export default suppliersSlice.reducer;

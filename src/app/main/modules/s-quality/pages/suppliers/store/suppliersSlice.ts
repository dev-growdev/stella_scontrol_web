import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { showMessage } from 'app/store/fuse/messageSlice';
import { ISupplier, ISupplierCreate } from '../types/supplier';
import { ReduxStateSquality } from '~/modules/s-quality/store';
import { httpClient } from '~/shared/services/http-client/api';

export const createSupplier = createAppAsyncThunk(
  '/squality/fornecedores/cadastro',
  async (data: ISupplierCreate, { dispatch, rejectWithValue }) => {
    const response = await httpClient.doPost('/squality/suppliers', data);
    if (!response.success) {
      dispatch(
        showMessage({
          message: response.message,
          variant: 'error'
        })
      );
      return rejectWithValue(response);
    }

    dispatch(
      showMessage({
        message: 'Supplier successfully registered',
        variant: 'success'
      })
    );

    return response.data;
  }
);

const suppliersAdapter = createEntityAdapter<ISupplier>({
  selectId: supplier => supplier.id
});

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState: suppliersAdapter.getInitialState({
    loading: false
  }),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createSupplier.pending, state => {
        state.loading = true;
      })
      .addCase(createSupplier.fulfilled, (state, action: PayloadAction<ISupplier>) => {
        suppliersAdapter.addOne(state, action.payload);
        state.loading = false;
      })
      .addCase(createSupplier.rejected, state => {
        state.loading = false;
      });
  }
});

export const selectSuppliers = ({ squality }: ReduxStateSquality) => squality.suppliers;
export const { selectAll: selectAllSuppliers } = suppliersAdapter.getSelectors(selectSuppliers);
export default suppliersSlice.reducer;

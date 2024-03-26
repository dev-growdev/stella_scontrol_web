import { combineReducers } from '@reduxjs/toolkit';
import suppliers from '../pages/suppliers/store/suppliersSlice';

export const squalityReducers = combineReducers({
  suppliers
});

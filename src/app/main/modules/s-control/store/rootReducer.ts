import { combineReducers } from '@reduxjs/toolkit';
import categories from '../categories/store/categoriesSlice';
import requestPaymentGeneral from '../form-request/store/FormRequestSlice';
import accountingAccount from '../form-request/store/AccountingAccountSlice';
import costCenterSlice from './slices/costCenterSlice';
import products from '../products/store/productsSlice';
import paymentsForm from './slices/PaymentsFormSlice';

export const scontrolReducers = combineReducers({
	accountingAccount,
	categories,
	costCenter: costCenterSlice,
	paymentsForm,
	products,
	requestPaymentGeneral
});
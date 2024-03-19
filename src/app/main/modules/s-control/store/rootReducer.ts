import { combineReducers } from '@reduxjs/toolkit';
import costCenter from './slices/costCenterSlice';
import paymentsForm from './slices/PaymentsFormSlice';

import categories from '../pages/categories/store/categoriesSlice';
import requestPaymentGeneral from '../pages/form-request/store/FormRequestSlice';
import accountingAccount from '../pages/form-request/store/AccountingAccountSlice';
import products from '../pages/products/store/productsSlice';

export const scontrolReducers = combineReducers({
	accountingAccount,
	categories,
	costCenter,
	paymentsForm,
	products,
	requestPaymentGeneral
});

import { combineReducers, ReducersMapObject } from '@reduxjs/toolkit';
import categories from '../main/categories/categoriesSlice';
import requestPaymentGeneral from '../main/form-request/FormRequestSlice';
import products from '../main/products/productsSlice';
import costCenter from './cost-center/costCenterSlice';
import fuse from './fuse';
import i18n from './i18nSlice';
import user from './user/userSlice';

/**
 * Creates a reducer function that combines the provided reducers with the async reducers.
 */
const createReducer = (asyncReducers: ReducersMapObject) =>
	combineReducers({
		fuse,
		user,
		costCenter,
		categories,
		requestPaymentGeneral,
		products,
		i18n,
		...asyncReducers
	} as ReducersMapObject);

/* Reset the redux store when user logged out */
/**
	if (action.type === 'user/userLoggedOut') {
		// state = undefined;
	}
	return combinedReducer(state, action);
*/

export default createReducer;

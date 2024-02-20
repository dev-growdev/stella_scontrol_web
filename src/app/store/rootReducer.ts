import { combineReducers, ReducersMapObject } from '@reduxjs/toolkit';
import user from './user/userSlice';
import i18n from './i18nSlice';
import fuse from './fuse';
import productsSlice from '../main/products/productsSlice'

/**
 * Creates a reducer function that combines the provided reducers with the async reducers.
 */
const createReducer = (asyncReducers: ReducersMapObject) =>
	combineReducers({
		fuse,
		user,
		i18n,
		productsSlice,
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

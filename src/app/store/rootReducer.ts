import { combineReducers, ReducersMapObject } from '@reduxjs/toolkit';
import categories from '../main/categories/categoriesSlice';
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
		categories,
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

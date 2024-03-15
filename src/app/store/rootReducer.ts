import { combineReducers, ReducersMapObject } from '@reduxjs/toolkit';
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
		i18n,
		// ...scontrolReducers,
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

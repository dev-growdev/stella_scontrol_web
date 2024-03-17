import { combineReducers } from '@reduxjs/toolkit';
import counter from './slices/counterSlice';

export const squalityReducers = combineReducers({
	counter
});

import { configureStore } from '@reduxjs/toolkit';
import { scontrolReducers } from './modules/rootReducer';

export const scontrolStore = configureStore({
	reducer: scontrolReducers,
	middleware: getDefaultMiddleware => getDefaultMiddleware(),
	devTools: process.env.NODE_ENV !== 'production'
});

export type ReduxStateScontrol = ReturnType<typeof scontrolStore.getState>;
export type AppDispatchScontrol = typeof scontrolStore.dispatch;

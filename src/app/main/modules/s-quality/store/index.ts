import { configureStore } from '@reduxjs/toolkit';
import { squalityReducers } from './rootReducer';

export const squalityStore = configureStore({
  reducer: squalityReducers,
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production'
});

export type ReduxStateSquality = { squality: ReturnType<typeof squalityStore.getState> };
export type AppDispatchSquality = typeof squalityStore.dispatch;
export type PropsAsyncThunkSQuality = {
  dispatch: AppDispatchSquality;
  state: ReduxStateSquality['squality'];
};

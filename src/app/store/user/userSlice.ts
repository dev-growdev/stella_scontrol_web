/* eslint import/no-extraneous-dependencies: off */
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import history from '@history';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import settingsConfig from 'app/configs/settingsConfig';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { AppDispatchType, RootStateType } from 'app/store/types';
import { UserType } from 'app/store/user';
import { AxiosError } from 'axios/index';
import { PartialDeep } from 'type-fest';
import jwtService from '../../auth/services/jwtService';
import createAppAsyncThunk from '../createAppAsyncThunk';

type AppRootStateType = RootStateType<userSliceType>;

/**
 * Sets the user data in the Redux store and updates the login redirect URL if provided.
 */
export const setUser = createAsyncThunk('user/setUser', async (user: UserType) => {
	/*
    You can redirect the logged-in user to a specific route depending on his role
    */
	if (user.loginRedirectUrl) {
		settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
	}

	user.role = ['squality', 'scontrol']; // admin
	user.modules = ['squality', 'scontrol'];
	return user;
});

/**
 * Updates the user's settings in the Redux store and returns the updated user object.
 */
export const updateUserSettings = createAppAsyncThunk(
	'user/updateSettings',
	async (settings: FuseSettingsConfigType, { dispatch, rejectWithValue, getState }) => {
		const AppState = getState() as AppRootStateType;
		const { user } = AppState;

		const isUserGuest = selectIsUserGuest(AppState);

		if (isUserGuest) {
			return null;
		}

		const userRequestData = { data: { ...user.data, settings } } as UserType;

		try {
			// @ts-expect-error - Service Fuse
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			const response: { data: UserType } = await jwtService.updateUserData(userRequestData);

			dispatch(showMessage({ message: 'User settings saved with api' }));

			return response.data;
		} catch (error) {
			const axiosError = error as AxiosError;

			dispatch(showMessage({ message: axiosError.message }));

			return rejectWithValue(axiosError.message);
		}
	}
);

/**
 * Updates the user's shortcuts in the Redux store and returns the updated user object.
 */
export const updateUserShortcuts = createAppAsyncThunk(
	'user/updateShortucts',
	async (shortcuts: string[], { dispatch, getState, rejectWithValue }) => {
		const AppState = getState() as AppRootStateType;
		const { user } = AppState;

		const isUserGuest = selectIsUserGuest(AppState);

		if (isUserGuest) {
			return null;
		}

		const userRequestData = {
			data: { ...user.data, shortcuts }
		} as PartialDeep<UserType>;

		try {
			// @ts-expect-error - Service Fuse
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			const response: { data: UserType } = await jwtService.updateUserData(userRequestData);

			dispatch(showMessage({ message: 'User shortcuts saved with api' }));

			return response.data;
		} catch (error) {
			const axiosError = error as AxiosError;

			dispatch(showMessage({ message: axiosError.message }));

			return rejectWithValue(axiosError.message);
		}
	}
);

/**
 * Logs the user out and resets the Redux store.
 */
export const logoutUser = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const AppState = getState() as AppRootStateType;

	const isUserGuest = selectIsUserGuest(AppState);

	if (isUserGuest) {
		return null;
	}

	history.push({
		pathname: '/'
	});

	dispatch(setInitialSettings());

	return Promise.resolve(dispatch(userLoggedOut()));
};

/**
 * Updates the user's data in the Redux store and returns the updated user object.
 */
export const updateUserData = createAppAsyncThunk<UserType, PartialDeep<UserType>>(
	'user/update',
	async (userRequestData, { dispatch, rejectWithValue, getState }) => {
		const AppState = getState() as AppRootStateType;

		const isUserGuest = selectIsUserGuest(AppState);

		if (isUserGuest) {
			return null;
		}

		try {
			// @ts-expect-error - Service Fuse
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			const response: { data: UserType } = await jwtService.updateUserData(userRequestData);

			dispatch(showMessage({ message: 'User data saved with api' }));

			return response.data;
		} catch (error) {
			const axiosError = error as AxiosError;

			dispatch(showMessage({ message: axiosError.message }));

			return rejectWithValue(axiosError.message);
		}
	}
);

/**
 * The initial state of the user slice.
 */
const initialState: UserType = {
	uid: '',
	role: [], // guest
	data: {
		displayName: '',
		photoURL: '',
		email: ''
	}
};

/**
 * The User slice
 */
export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		userLoggedOut: () => initialState
	},
	extraReducers: builder => {
		builder
			.addCase(setUser.fulfilled, (state, action) => action.payload)
			.addCase(updateUserData.fulfilled, (state, action) => action.payload)
			.addCase(updateUserShortcuts.fulfilled, (state, action) => {
				state.data.shortcuts = action.payload.data.shortcuts;
			})
			.addCase(updateUserSettings.fulfilled, (state, action) => {
				state.data.settings = action.payload.data.settings;
			});
	}
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = (state: AppRootStateType) => state.user;

export const selectUserRole = (state: AppRootStateType) => state.user.role;

export const selectIsUserGuest = (state: AppRootStateType) => {
	const { role } = state.user;

	return !role || role.length === 0;
};

export const selectUserShortcuts = (state: AppRootStateType) => state.user.data.shortcuts;

export type userSliceType = typeof userSlice;

export default userSlice.reducer;

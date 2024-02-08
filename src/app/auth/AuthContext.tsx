import { useMsal } from '@azure/msal-react';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { graphConfig, loginRequest } from 'app/configs/authConfig';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { UserType } from 'app/store/user';
import { logoutUser, setUser } from 'app/store/user/userSlice';
import axios, { AxiosError } from 'axios';
import * as React from 'react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import jwtService from './services/jwtService';

/**
 * The AuthContext object is a React context object that provides authentication information to child components.
 */
const AuthContext = React.createContext({});

type AuthProviderProps = { children: ReactNode };

/**
 * The AuthProvider component is a wrapper component that provides authentication information to child components.
 */
function AuthProvider(props: AuthProviderProps) {
	const { children } = props;
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [waitAuthCheck, setWaitAuthCheck] = useState(true);
	const dispatch = useAppDispatch();
	const val = useMemo(() => ({ isAuthenticated }), [isAuthenticated]);
	const { instance, accounts } = useMsal()

	useEffect(() => {
		jwtService.on('onAutoLogin', () => {
			/**
			 * Sign in and retrieve user data with stored token
			 */
			jwtService
				.signInWithToken()
				.then(user => {
					success(user as UserType, '');
				})
				.catch((error: AxiosError) => {
					pass(error.message);
				});
		});

		jwtService.on('onLogin', (user: UserType) => {
			success(user, 'Signed in');
		});

		jwtService.on('onLogout', () => {
			pass('Signed out');

			dispatch(logoutUser());
		});

		jwtService.on('onAutoLogout', (message: string) => {
			pass(message);

			dispatch(logoutUser());
		});

		jwtService.on('onNoAccessToken', () => {
			pass();
		});

		jwtService.init();

		function success(user: UserType, message: string) {
			Promise.all([
				dispatch(setUser(user))

			]).then(() => {
				if (message) {
					dispatch(showMessage({ message }));
				}

				setWaitAuthCheck(false);
				setIsAuthenticated(true);
			});
		}

		function pass(message?: string) {
			if (message) {
				dispatch(showMessage({ message }));
			}

			setWaitAuthCheck(false);
			setIsAuthenticated(false);
		}
	}, [dispatch]);

	useEffect(() => {
		setTimeout(() => {
			instance
				.acquireTokenSilent({
					...loginRequest,
					account: accounts[0]
				})
				.then((getToken) => {
					axios.get(graphConfig.graphMeEndpoint, { headers: { Authorization: `Bearer ${getToken.accessToken}` } })
						.then((responseFromToken) => {
							console.log(responseFromToken)
							// Aqui prossegue com o usuário autenticado

							//só entra nessa lógica se o usuário já está conectado

						}).catch((err) => {
							console.log(err)
							//aqui vai a lógica para desconectar e excluir o usuário
						})

				})
		}, 2000)
	}, [])

	return waitAuthCheck ? <FuseSplashScreen /> : <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
}

function useAuth() {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within a AuthProvider');
	}
	return context;
}

export { AuthProvider, useAuth };


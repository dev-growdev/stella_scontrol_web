import FuseUtils from '@fuse/utils/FuseUtils';
import UserType from 'app/store/user/UserType';
import axios, { AxiosError, AxiosResponse } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import jwtServiceConfig from './jwtServiceConfig';
/* eslint-disable camelcase, class-methods-use-this */

class JwtService extends FuseUtils.EventEmitter {

	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			(response: AxiosResponse<unknown>) => response,
			(err: AxiosError) =>
				new Promise(() => {
					if (err?.response?.status === 401 && err.config) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						_setSession(null);
					}
					throw err;
				})
		);
	};

	handleAuthentication = () => {
		const access_token = getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (isAuthTokenValid(access_token)) {
			_setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			_setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	signInWithToken = () => {
		const token = getAccessToken()

		if (token) {
			_setSession(token);
		}

		return new Promise<UserType>((resolve, reject) => {
			axios
				.get(jwtServiceConfig.accessToken, {
					data: {
						access_token: getAccessToken()
					}
				})

				.then((response: AxiosResponse<{
					data: {
						user: {
							uid: string,
							name: string,
							email: string,
							idUserAd: string,
							jobTitle: string,
							data: {
								displayName: string,
								email: string
							}
						};
						access_token: string
					}
				}>) => {
					const userFromResponse = response.data.data.user

					if (userFromResponse) {
						const user = {
							uid: userFromResponse.uid,
							idUserAd: userFromResponse.idUserAd,
							jobTile: userFromResponse.jobTitle,
							role: ["admin"],
							data: {
								displayName: userFromResponse.data.displayName,
								email: userFromResponse.data.email
							}
						}

						resolve(user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(() => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	}

	signInWithId = (data: any) => {
		return new Promise<UserType>((resolve, reject) => {
			axios
				.post(jwtServiceConfig.accessById, data)
				.then((response: AxiosResponse<{
					data: {
						user: {
							uid: string,
							name: string,
							email: string,
							idUserAd: string,
							jobTitle: string
						};
						access_token: string
					}
				}>) => {
					const userFromResponse = response.data.data.user
					if (userFromResponse) {
						const token = response.data.data.access_token
						_setSession(token);
						const user = {
							uid: userFromResponse.uid,
							idUserAd: userFromResponse.idUserAd,
							jobTile: userFromResponse.jobTitle,
							role: ["admin"],
							data: {
								displayName: userFromResponse.name,
								email: userFromResponse.email
							}
						}
						resolve(user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(() => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		})
	}

	logout = () => {
		_setSession(null);
		this.emit('onLogout', 'Logged out');
	};
}

function _setSession(access_token: string | null) {
	if (access_token) {
		setAccessToken(access_token);
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	} else {
		removeAccessToken();
		delete axios.defaults.headers.common.Authorization;
	}
}

function isAuthTokenValid(access_token: string) {
	if (!access_token) {
		return false;
	}
	const decoded = jwtDecode<JwtPayload>(access_token);
	const currentTime = Date.now() / 1000;

	if (decoded.exp < currentTime) {
		// eslint-disable-next-line no-console
		console.warn('access token expired');
		return false;
	}

	return true;
}

function getAccessToken() {
	return window.localStorage.getItem('jwt_access_token');
}

function setAccessToken(access_token: string) {
	return window.localStorage.setItem('jwt_access_token', access_token);
}

function removeAccessToken() {
	return window.localStorage.removeItem('jwt_access_token');
}

const instanceJwt = new JwtService();

export default instanceJwt;

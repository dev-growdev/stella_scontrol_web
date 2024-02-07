/**
 * Configuration object containing the authentication service API endpoints
 */
const jwtServiceConfig = {
	signIn: 'api/auth/sign-in',
	signUp: 'api/auth/sign-up',
	accessToken: 'http://localhost:8081/api/auth',
	updateUser: 'api/auth/user/update',
	accessById: 'http://localhost:8081/api/login'
};

export default jwtServiceConfig;

/**
 * Configuration object containing the authentication service API endpoints
 */
const jwtServiceConfig = {
	accessToken: `${process.env.REACT_APP_API_URL}/auth`,
	accessById: `${process.env.REACT_APP_API_URL}/login`
};

export default jwtServiceConfig;

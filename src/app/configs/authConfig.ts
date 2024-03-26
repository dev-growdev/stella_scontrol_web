import { Configuration, LogLevel } from '@azure/msal-browser';
import { env } from 'src/envs';

export const msalConfig: Configuration = {
	auth: {
		clientId: env.REACT_APP_CLIENT_ID,
		authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
		redirectUri: `${process.env.REACT_APP_REDIRECT_URI}/solicitacoes`
	},
	cache: {
		cacheLocation: 'localStorage',
		storeAuthStateInCookie: false
	},
	system: {
		loggerOptions: {
			loggerCallback: (level: LogLevel, message: string, containsPii: any) => {
				if (containsPii) {
					return;
				}
				switch (level) {
					case LogLevel.Error:
						console.error(message);
						return;
					case LogLevel.Info:
						console.info(message);
						return;
					case LogLevel.Verbose:
						console.debug(message);
						return;
					case LogLevel.Warning:
						console.warn(message);

					default:
				}
			}
		}
	}
};

export const loginRequest = {
	scopes: ['User.Read']
};

export const graphConfig = {
	graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me'
};

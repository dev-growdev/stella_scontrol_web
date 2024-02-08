// import createGenerateClassName from '@mui/styles/createGenerateClassName';
// import jssPreset from '@mui/styles/jssPreset';
// import { create } from 'jss';
// import jssExtend from 'jss-plugin-extend';
// import rtl from 'jss-rtl';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { StyledEngineProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import routes from 'app/configs/routesConfig';
import { useMemo } from 'react';
import Provider from 'react-redux/es/components/Provider';
import AppContext from './AppContext';
import { msalConfig } from './configs/authConfig';
import store from './store';

type ComponentProps = {
	name?: string;
};

/**
 * A Higher Order Component that provides the necessary context providers for the app.
 */
function withAppProviders(Component: React.ComponentType<ComponentProps>) {
	/**
	 * The component that wraps the provided component with the necessary context providers.
	 */
	function WithAppProviders(props: React.PropsWithChildren<ComponentProps>) {
		/**
		 * The value to pass to the AppContext provider.
		 */
		const val = useMemo(
			() => ({
				routes
			}),
			[routes]
		);

		const msalInstance = new PublicClientApplication(msalConfig);

		return (
			<MsalProvider instance={msalInstance}>
				<AppContext.Provider value={val}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<Provider store={store}>
							<StyledEngineProvider injectFirst>
								<Component {...props} />
							</StyledEngineProvider>
						</Provider>
					</LocalizationProvider>
				</AppContext.Provider>
			</MsalProvider>
		);
	}

	return WithAppProviders;
}

export default withAppProviders;

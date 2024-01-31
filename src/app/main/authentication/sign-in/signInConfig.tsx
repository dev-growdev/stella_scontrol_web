import { lazy } from 'react';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';

const SignInPage = lazy(() => import('./SignInPage'));

/**
 * The sign in pages config.
 */
const signInPagesConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'sign-in',
			element: <SignInPage />
		}
	]
};

export default signInPagesConfig;

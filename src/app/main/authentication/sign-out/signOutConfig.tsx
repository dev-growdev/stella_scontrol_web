import { lazy } from 'react';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';

const SignOutPage = lazy(() => import('./SignOutPage'));

/**
 * The sign out pages config.
 */
const signOutPagesConfig: FuseRouteConfigType = {
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
			path: 'ign-out',
			element: <SignOutPage />
		}
	]
};

export default signOutPagesConfig;

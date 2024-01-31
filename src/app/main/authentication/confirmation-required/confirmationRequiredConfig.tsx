import { lazy } from 'react';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';

const ConfirmationRequiredPage = lazy(() => import('./ConfirmationRequiredPage'));

/**
 * Route Configuration for Confirmation Required Pages.
 */
const confirmationRequiredPagesConfig: FuseRouteConfigType = {
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
			path: 'confirmation-required',
			element: <ConfirmationRequiredPage />
		}
	]
};

export default confirmationRequiredPagesConfig;

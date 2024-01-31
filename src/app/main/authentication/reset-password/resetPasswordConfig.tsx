import { lazy } from 'react';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';

const ResetPasswordPage = lazy(() => import('./ResetPasswordPage'));

/**
 * The reset password pages config.
 */
const resetPasswordPagesConfig: FuseRouteConfigType = {
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
			path: 'reset-password',
			element: <ResetPasswordPage />
		}
	]
};

export default resetPasswordPagesConfig;

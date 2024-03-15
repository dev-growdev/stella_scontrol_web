import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const PaymentsForm = lazy(() => import('./pages/PaymentsForm'));

/**
 * The sign up pages config.
 */
export const paymentsFormRoutes: FuseRouteItemType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: true
				},
				toolbar: {
					display: true
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: true
				},
				rightSidePanel: {
					display: true
				}
			}
		}
	},
	auth: authRoles.admin,
	path: 'formas-de-pagamento',
	element: <PaymentsForm />
};

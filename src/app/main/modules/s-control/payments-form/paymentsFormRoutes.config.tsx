import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const PaymentsForm = lazy(() => import('./screens/PaymentsForm'));

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
	// auth: authRoles.admin,
	path: 'formas-de-pagamento',
	children: [
		{
			path: '',
			element: <PaymentsForm />
		}
	]
};

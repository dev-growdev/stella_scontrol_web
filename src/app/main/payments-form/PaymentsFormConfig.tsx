import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const PaymentsForm = lazy(() => import('./PaymentsForm'));

/**
 * The sign up pages config.
 */
const PaymentsFormConfig: FuseRouteConfigType = {
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
	routes: [
		{
			path: 'formas-de-pagamento',
			element: <PaymentsForm />
		}
	]
};

export default PaymentsFormConfig;

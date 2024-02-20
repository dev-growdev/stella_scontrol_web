import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const PaymentRequestFormGeneral = lazy(() => import('./FormRequest'));

/**
 * The sign up pages config.
 */
const paymentRequestFormGeneralPageConfig: FuseRouteConfigType = {
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
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: 'solicitar-pagamento',
			element: <PaymentRequestFormGeneral />
		}
	]
};

export default paymentRequestFormGeneralPageConfig;

import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const Request = lazy(() => import('./pages/Requests'));
const PaymentRequestFormGeneral = lazy(() => import('./pages/form-request/FormRequest'));

/**
 * The sign up pages config.
 */
export const formRequestRoutes: FuseRouteItemType = {
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
	children: [
		{
			path: 'solicitacoes',
			element: <Request />
		},
		{
			path: 'solicitar-pagamento',
			element: <PaymentRequestFormGeneral />
		}
	]
};

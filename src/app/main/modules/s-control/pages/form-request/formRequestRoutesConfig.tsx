import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const Request = lazy(() => import('./screens/Requests'));
const PaymentRequestFormGeneral = lazy(() => import('./screens/form-request/FormRequest'));

/**
 * The sign up pages config.
 */
export const formRequestRoutes: FuseRouteItemType = {
	// auth: authRoles.admin,
	path: 'solicitacoes',
	children: [
		{
			path: '',
			element: <Request />
		},
		{
			path: 'cadastro/:requestUid?/:edit?',
			element: <PaymentRequestFormGeneral />
		}
	]
};

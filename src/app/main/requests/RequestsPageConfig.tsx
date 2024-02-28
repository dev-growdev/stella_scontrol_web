import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const Requests = lazy(() => import('./RequestsPage'));

/**
 * The sign up pages config.
 */
const RequestsPageConfig: FuseRouteConfigType = {
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
			path: 'solicitacoes',
			element: <Requests />
		}
	]
};

export default RequestsPageConfig;

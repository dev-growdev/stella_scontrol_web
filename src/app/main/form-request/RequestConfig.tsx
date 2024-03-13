import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const Request = lazy(() => import('./Requests'));

/**
 * The sign up pages config.
 */
const requestPageConfig: FuseRouteConfigType = {
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
			path: 'solicitacoes',
			element: <Request />
		}
	]
};

export default requestPageConfig;

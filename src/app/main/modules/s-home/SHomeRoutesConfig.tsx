import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';
import { SHomeModule } from '.';
import { homeRoutes } from './pages/home/HomeRoutesConfig';

export const shomeRoutes: FuseRouteConfigType = {
	routes: [
		{
			settings: {
				layout: {
					config: {
						navbar: {
							display: false
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
			path: '/',
			auth: [...authRoles.squality, ...authRoles.scontrol],
			element: <SHomeModule />,
			children: [homeRoutes]
		}
	]
};

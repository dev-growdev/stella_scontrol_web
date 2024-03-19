import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';
import { homeRoutesConfig } from './pages/home/homeRoutesConfig';
import { SQualityModule } from '.';
import { suppliersRoutesConfig } from './pages/suppliers/suppliersRoutesConfig';

export const squalityRoutes: FuseRouteConfigType = {
	routes: [
		{
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
			path: '/squality',
			auth: authRoles.squality,
			element: <SQualityModule />,
			children: [homeRoutesConfig, suppliersRoutesConfig]
		}
	]
};

import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';
import HomeRoutesConfig from './home/homeConfig';
import { SQualityModule } from '.';

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
			children: [...HomeRoutesConfig]
		}
	]
};

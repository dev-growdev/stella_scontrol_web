import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';
import { SControlModule } from '.';
import { paymentsFormRoutes } from './payments-form/paymentsFormRoutes.config';
import { productsRoutes } from './products/productsRoutes.config';
import { categoriesRoutes } from './categories/CategoriesRoutes.config';
import { formRequestRoutes } from './form-request/formRequestRoutes.config';

export const scontrolRoutes: FuseRouteConfigType = {
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
			path: '/scontrol',
			auth: authRoles.scontrol,
			element: <SControlModule />,
			children: [paymentsFormRoutes, productsRoutes, categoriesRoutes, formRequestRoutes]
		}
	]
};

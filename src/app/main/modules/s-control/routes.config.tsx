import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';
import { LayoutSControl } from './layout';
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
			auth: authRoles.admin,
			element: <LayoutSControl />,
			children: [paymentsFormRoutes, productsRoutes, categoriesRoutes, formRequestRoutes]
		}
	]
};

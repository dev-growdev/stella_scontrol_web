import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';
import { SControlModule } from '.';
import { paymentsFormRoutes } from './pages/payments-form/paymentsFormRoutesConfig';
import { categoriesRoutes } from './pages/categories/CategoriesRoutesConfig';
import { formRequestRoutes } from './pages/form-request/formRequestRoutesConfig';
import { productsRoutes } from './pages/products/productsRoutesConfig';

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

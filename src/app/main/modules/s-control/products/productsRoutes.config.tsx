import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const CreateProductsPage = lazy(() => import('./pages/CreateProducts'));
const ProductsPage = lazy(() => import('./pages/Products'));

export const productsRoutes: FuseRouteItemType = {
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
	path: 'produtos',
	children: [
		{
			path: 'cadastrar-produto/:productUid?',
			element: <CreateProductsPage />
		},
		{
			path: 'produtos',
			element: <ProductsPage />
		}
	]
};

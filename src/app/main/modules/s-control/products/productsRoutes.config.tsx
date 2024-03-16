import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

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
					display: true
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
	// auth: authRoles.admin,
	path: 'produtos',
	children: [
		{
			path: '',
			element: <ProductsPage />
		},
		{
			path: 'cadastrar-produto/:productUid?',
			element: <CreateProductsPage />
		}
	]
};

import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const CreateProductsPage = lazy(() => import('./pages/CreateProducts'));
const ProductsPage = lazy(() => import('./pages/Products'));

export const productsRoutes: FuseRouteItemType = {
	// auth: authRoles.admin,
	path: 'produtos',
	children: [
		{
			path: '',
			element: <ProductsPage />
		},
		{
			path: 'cadastro/:productUid?',
			element: <CreateProductsPage />
		}
	]
};

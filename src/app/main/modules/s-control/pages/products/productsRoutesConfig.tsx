import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const CreateProductsPage = lazy(() => import('./screens/CreateProducts'));
const ProductsPage = lazy(() => import('./screens/Products'));

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

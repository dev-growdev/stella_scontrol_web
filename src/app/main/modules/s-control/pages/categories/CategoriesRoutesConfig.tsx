import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const CategoriesPage = lazy(() => import('./screens/Categories'));

/**
 * The sign up pages config.
 */
export const categoriesRoutes: FuseRouteItemType = {
	// auth: authRoles.admin,
	children: [
		{
			path: 'categorias',
			element: <CategoriesPage />
		}
	]
};

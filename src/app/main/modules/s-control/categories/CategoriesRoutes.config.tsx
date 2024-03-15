import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const CategoriesPage = lazy(() => import('./pages/Categories'));

/**
 * The sign up pages config.
 */
export const categoriesRoutes: FuseRouteItemType = {
	auth: authRoles.admin,
	children: [
		{
			path: 'categorias',
			element: <CategoriesPage />
		}
	]
};

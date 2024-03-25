import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const CreateSuppliersPage = lazy(() => import('./screens/CreateSuppliers'));
const SuppliersPage = lazy(() => import('./screens/list/Suppliers'));

export const suppliersRoutesConfig: FuseRouteItemType = {
	// auth: authRoles.admin,
	path: 'suppliers',
	children: [
		{
			path: '',
			element: <SuppliersPage />
		},
		{
			path: 'cadastro',
			element: <CreateSuppliersPage />
		}
	]
};

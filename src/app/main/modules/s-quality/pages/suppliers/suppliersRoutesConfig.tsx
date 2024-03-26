import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const SupplierDetail = lazy(() => import('./screens/detail/SupplierDetail'));
const SuppliersList = lazy(() => import('./screens/list/Suppliers'));

export const suppliersRoutesConfig: FuseRouteItemType = {
  // auth: authRoles.admin,
  path: 'suppliers',
  children: [
    {
      path: '',
      element: <SuppliersList />
    },
    {
      path: 'cadastro',
      element: <SupplierDetail />
    }
  ]
};

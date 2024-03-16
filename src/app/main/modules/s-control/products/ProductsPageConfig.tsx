import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const ProductsPage = lazy(() => import('./pages/Products'));

/**
 * The sign up pages config.
 */
const ProductsPageConfig: FuseRouteConfigType = {
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
	routes: [
		{
			path: 'produtos',
			element: <ProductsPage />
		}
	]
};

export default ProductsPageConfig;

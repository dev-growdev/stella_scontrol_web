import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';


const CategoriesPage = lazy(() => import('./CategoriesPage'));

/**
 * The sign up pages config.
 */
const categoriesPageConfig: FuseRouteConfigType = {
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
    routes: [
        {
            path: 'categorias',
            element: <CategoriesPage />
        }
    ]
};

export default categoriesPageConfig;

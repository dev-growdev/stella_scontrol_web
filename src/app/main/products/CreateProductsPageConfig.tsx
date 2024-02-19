import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';


const CreateProductsPage = lazy(() => import('./CreateProductsPage'));

/**
 * The sign up pages config.
 */
const CreateProductsPageConfig: FuseRouteConfigType = {
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
    auth: authRoles.onlyGuest,
    routes: [
        {
            path: 'cadastrar-produto',
            element: <CreateProductsPage />
        }
    ]
};

export default CreateProductsPageConfig;

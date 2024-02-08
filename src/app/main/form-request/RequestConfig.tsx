import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { authRoles } from 'src/app/auth';


const Request = lazy(() => import('./Request'));

/**
 * The sign up pages config.
 */
const requestPageConfig: FuseRouteConfigType = {
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
                    display: true
                },
                rightSidePanel: {
                    display: true
                }
            }
        }
    },
    auth: authRoles.onlyGuest,
    routes: [
        {
            path: 'solicitacoes',
            element: <Request />
        }
    ]
};

export default requestPageConfig;

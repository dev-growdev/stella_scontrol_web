import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Home } from './screens/Home';

/**
 * The sign up pages config.
 */
export const homeRoutesConfig: FuseRouteItemType = {
	// auth: authRoles.admin,
	path: '',
	element: <Home />
};

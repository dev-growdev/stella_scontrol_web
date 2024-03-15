import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';

/**
 * The sign up pages config.
 */
const HomeRoutesConfig: FuseRouteItemType[] = [
	{
		auth: authRoles.admin,
		path: '',
		element: <p className="text-4xl">Growdev</p>
	}
];

export default HomeRoutesConfig;

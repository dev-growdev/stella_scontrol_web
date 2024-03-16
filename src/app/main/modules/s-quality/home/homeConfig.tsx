import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

/**
 * The sign up pages config.
 */
const HomeRoutesConfig: FuseRouteItemType[] = [
	{
		// auth: authRoles.admin,
		path: '',
		element: <p className="text-4xl">Growdev</p>
	}
];

export default HomeRoutesConfig;

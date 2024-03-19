import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Home } from './screens/Home';
import { Counter } from '../counter/screens/Counter';

/**
 * The sign up pages config.
 */
const HomeRoutesConfig: FuseRouteItemType[] = [
	{
		// auth: authRoles.admin,
		path: '',
		element: <Home />
	},
	{
		path: 'counter',
		element: <Counter />
	}
];

export default HomeRoutesConfig;

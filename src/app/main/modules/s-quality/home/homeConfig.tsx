import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Home } from './pages/Home';
import { Counter } from '../counter/pages/Counter';

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

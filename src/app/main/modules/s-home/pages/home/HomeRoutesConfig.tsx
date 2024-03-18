import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const Home = lazy(() => import('./screens/Home'));

export const homeRoutes: FuseRouteItemType = {
	children: [
		{
			path: '',
			element: <Home />
		}
	]
};

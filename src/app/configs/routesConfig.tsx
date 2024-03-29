import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import settingsConfig from 'app/configs/settingsConfig';
import { Navigate } from 'react-router-dom';
import Error404Page from '../main/404/Error404Page';
import authenticationConfig from '../main/authentication/authenticationConfig';
import { scontrolRoutes } from '../main/modules/s-control/SControlRoutesConfig';
import { squalityRoutes } from '../main/modules/s-quality/routes.config';

// const scontrolRoutesPrefixed = addPrefixToRoutes('scontrol', scontrolRoutes);
const routeConfigs: FuseRouteConfigsType = [...authenticationConfig, scontrolRoutes, squalityRoutes];

/**

The routes of the application. */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/scontrol/solicitacoes" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];

export default routes;

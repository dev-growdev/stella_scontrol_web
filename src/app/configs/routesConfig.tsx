import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import settingsConfig from 'app/configs/settingsConfig';
import { Navigate } from 'react-router-dom';
import Error404Page from '../main/404/Error404Page';
import authenticationConfig from '../main/authentication/authenticationConfig';
import categoriesPageConfig from '../main/categories/CategoriesPageConfig';
import paymentRequestFormGeneralPageConfig from '../main/form-request/FormRequestConfig';
import requestPageConfig from '../main/form-request/RequestConfig';
import CreateProductsPageConfig from '../main/products/CreateProductsPageConfig';
import ProductsPageConfig from '../main/products/ProductsPageConfig';

const routeConfigs: FuseRouteConfigsType = [
	paymentRequestFormGeneralPageConfig,
	requestPageConfig,
	CreateProductsPageConfig,
	ProductsPageConfig,
	categoriesPageConfig,
	...authenticationConfig
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/solicitar-pagamento-geral" />,
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

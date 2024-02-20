import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import settingsConfig from 'app/configs/settingsConfig';
import { Navigate } from 'react-router-dom';
import Error404Page from '../main/404/Error404Page';
import authenticationConfig from '../main/authentication/authenticationConfig';
import ExampleConfig from '../main/example/ExampleConfig';
import PaymentRequestFormGeneral from '../main/form-request/FormRequest';
import paymentRequestFormGeneralPageConfig from '../main/form-request/FormRequestConfig';
import requestPageConfig from '../main/form-request/RequestConfig';
import CreateProductsPage from '../main/products/CreateProductsPage';
import CreateProductsPageConfig from '../main/products/CreateProductsPageConfig';
import ProductsPage from '../main/products/ProductsPage';
import ProductsPageConfig from '../main/products/ProductsPageConfig';

const routeConfigs: FuseRouteConfigsType = [
	ExampleConfig,
	paymentRequestFormGeneralPageConfig,
	requestPageConfig,
	CreateProductsPageConfig,
	ProductsPageConfig,
	...authenticationConfig
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/example" />,
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
	},
	{
		path: 'solicitar-pagamento',
		element: <PaymentRequestFormGeneral />
	},
	{
		path: 'cadastrar-produto',
		element: <CreateProductsPage />
	},
	{
		path: 'produtos',
		element: <ProductsPage />
	}
];

export default routes;

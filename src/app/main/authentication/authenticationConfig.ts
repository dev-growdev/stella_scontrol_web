import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import formRequestPageConfig from '../form-request/FormRequestConfig';
import confirmationRequiredConfig from './confirmation-required/confirmationRequiredConfig';
import forgotPasswordConfig from './forgot-password/forgotPasswordConfig';
import resetPasswordConfig from './reset-password/resetPasswordConfig';
import signInConfig from './sign-in/signInConfig';
import signOutConfig from './sign-out/signOutConfig';
import signUpConfig from './sign-up/signUpConfig';
import unlockSessionConfig from './unlock-session/unlockSessionConfig';

const authenticationPagesConfigs: FuseRouteConfigsType = [
	signInConfig,
	signUpConfig,
	signOutConfig,
	forgotPasswordConfig,
	resetPasswordConfig,
	confirmationRequiredConfig,
	unlockSessionConfig,
	formRequestPageConfig
];

export default authenticationPagesConfigs;

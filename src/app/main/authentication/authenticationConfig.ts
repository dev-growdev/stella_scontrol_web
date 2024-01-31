import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import signInConfig from './sign-in/signInConfig';
import signUpConfig from './sign-up/signUpConfig';
import signOutConfig from './sign-out/signOutConfig';
import confirmationRequiredConfig from './confirmation-required/confirmationRequiredConfig';
import forgotPasswordConfig from './forgot-password/forgotPasswordConfig';
import resetPasswordConfig from './reset-password/resetPasswordConfig';
import unlockSessionConfig from './unlock-session/unlockSessionConfig';

/**
 * The authentication pages config.
 */
const authenticationPagesConfigs: FuseRouteConfigsType = [
	signInConfig,
	signUpConfig,
	signOutConfig,
	forgotPasswordConfig,
	resetPasswordConfig,
	confirmationRequiredConfig,
	unlockSessionConfig
];

export default authenticationPagesConfigs;

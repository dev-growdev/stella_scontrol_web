import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { loginRequest } from 'app/configs/authConfig';
import { useAppDispatch } from "app/store";
import { setUser } from "app/store/user/userSlice";
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(8, 'Password is too short - must be at least 8 chars.')
});

type FormType = {
	email: string;
	password: string;
	remember?: boolean;
};

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

/**
 * The full screen sign in page.
 */
function FullScreenReversedSignInPage() {
	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const { instance } = useMsal();

	const isAuthenticated = useIsAuthenticated();

	function handleMicrosoftAD() {
		instance.loginPopup(loginRequest)
			.then((loginResponse) => {
				console.log(loginResponse)
				//accessToken: loginResponse.accessToken,
				const user = {
					role: ['admin'],
					data: {
						displayName: loginResponse.account.name,
						email: loginResponse.account.username
					}
				}
				dispatch(setUser(user))

				//enviar token, email, nome
			})
			.catch((e) => {
				console.log(e)
			})
	}

	function handleLogoutMicrosoft() {
		instance.logoutPopup({
			postLogoutRedirectUri: "/login",
			mainWindowRedirectUri: "/login",
		})
	}

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {
		reset(defaultValues);
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">


			<Paper className="h-full w-full px-16 py-32 ltr:border-l-1 rtl:border-r-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:rounded-none md:p-64 md:pt-96 md:shadow-none">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-48"
						src="assets/images/logo/logo.svg"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>
					<div className="mt-2 flex items-baseline font-medium">
						<Typography>Don't have an account?</Typography>
						<Link
							className="ml-4"
							to="/sign-up"
						>
							Sign up
						</Link>
					</div>

					<form
						name="loginForm"
						noValidate
						className="mt-32 flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Email"
									autoFocus
									type="email"
									error={!!errors.email}
									helperText={errors?.email?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Password"
									type="password"
									error={!!errors.password}
									helperText={errors?.password?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
							<Controller
								name="remember"
								control={control}
								render={({ field }) => (
									<FormControl>
										<FormControlLabel
											label="Remember me"
											control={
												<Checkbox
													size="small"
													{...field}
												/>
											}
										/>
									</FormControl>
								)}
							/>

							<Link
								className="text-md font-medium"
								to="/pages/auth/forgot-password"
							>
								Forgot password?
							</Link>
						</div>

						<Button
							variant="contained"
							color="secondary"
							className=" mt-16 w-full"
							aria-label="Sign in"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Sign in
						</Button>

						<div className="mt-32 flex items-center">
							<div className="mt-px flex-auto border-t" />
							<Typography
								className="mx-8"
								color="text.secondary"
							>
								Or continue with
							</Typography>
							<div className="mt-px flex-auto border-t" />
						</div>

						<div className="mt-32 flex items-center space-x-16">
							<Button onClick={handleMicrosoftAD}
								variant="outlined"
								className="flex-auto"
							>
								<MicrosoftIcon />

							</Button>
							<Button
								variant="outlined"
								className="flex-auto"
							>
								<FuseSvgIcon
									size={20}
									color="action"
								>
									feather:facebook
								</FuseSvgIcon>
							</Button>
							<Button
								variant="outlined"
								className="flex-auto"
							>
								<FuseSvgIcon
									size={20}
									color="action"
								>
									feather:twitter
								</FuseSvgIcon>
							</Button>
							<Button
								variant="outlined"
								className="flex-auto"
							>
								<FuseSvgIcon
									size={20}
									color="action"
								>
									feather:github
								</FuseSvgIcon>
							</Button>
						</div>
					</form>
				</div>
			</Paper>

			<Box
				className="relative bg-cover bg-no-repeat hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
				sx={{
					backgroundImage: `url('assets/images//pages/login-page/login-background.svg')`
				}}
			>

			</Box>
		</div>
	);
}

export default FullScreenReversedSignInPage;

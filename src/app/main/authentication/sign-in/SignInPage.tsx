import { useMsal } from "@azure/msal-react";
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { graphConfig, loginRequest } from 'app/configs/authConfig';
import { useAppDispatch } from "app/store";
import { UserType } from "app/store/user";
import { setUser } from "app/store/user/userSlice";
import axios from "axios";
import JwtService from "src/app/auth/services/jwtService";

function SignInPage() {
	const dispatch = useAppDispatch()

	const { instance } = useMsal();

	function handleMicrosoftAD() {
		instance.loginPopup(loginRequest)
			.then(async (loginResponse) => {
				const me = await axios.get(graphConfig.graphMeEndpoint, { headers: { Authorization: `Bearer ${loginResponse.accessToken}` } })
				const user = {
					idUserAd: me.data.id,
					email: me.data.userPrincipalName,
					name: me.data.displayName
				}
				JwtService.signInWithId(user)
					.then((user: UserType) => {
						dispatch(setUser(user))
					})
					.catch((errors) => {
						console.log(errors)
					})
			})
			.catch((e) => {
				console.log(e)
			})
	}


	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full items-center px-16 py-32 ltr:border-l-1 rtl:border-r-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:rounded-none md:p-64 md:pt-96 md:shadow-none">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-400"
						src="assets/images/logo/scontrol.svg"
						alt="logo"
					/>

					<Typography className="mt-20 text-3xl font-normal leading-tight tracking-tight">
						Bem-Vindo
					</Typography>
					<Typography className="mt-20 text-15 font-normal leading-tight tracking-tight">
						Acesse sua conta:
					</Typography>

					<div className="mt-32 flex items-center space-x-16">
						<Button onClick={handleMicrosoftAD}
							variant="outlined"
							className="flex-auto"
							sx={{ borderRadius: '7px' }}
						>
							<MicrosoftIcon sx={{ marginRight: '10px' }} />
							Entrar com a Microsoft
						</Button>

					</div>
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

export default SignInPage;

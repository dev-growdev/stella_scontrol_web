import { Grid, Typography } from '@mui/material';
import { useAppSelector } from 'app/store';
import { selectUser } from 'app/store/user/userSlice';
import BG from './bg.svg';

export default function Home() {
	const user = useAppSelector(selectUser);

	function handleNavigate(module: string) {
		window.location.href = `/${module}`;
	}

	function formattedModuleName(module: string): string {
		switch (module) {
			case 'scontrol':
				return 'S.Control';
			case 'squality':
				return 'S.Quality';
			default:
				return module;
		}
	}

	return (
		<Grid
			container
			xs={12}
			className="h-full w-full justify-evenly"
			sx={{ background: `url(${BG})`, backgroundSize: 'cover' }}
			alignItems="center"
			justifyContent="center"
		>
			{user &&
				user.modules.map(module => (
					<Grid
						item
						xs={3}
						height={200}
						className="cursor-pointer flex justify-center items-center bg-grey-600/70 hover:bg-grey-400/80 rounded-lg"
						key={module}
						onClick={() => handleNavigate(module)}
					>
						<Typography
							variant="h4"
							color="white"
							sx={{ color: '#565656' }}
						>
							{formattedModuleName(module)}
						</Typography>
					</Grid>
				))}
		</Grid>
	);
}

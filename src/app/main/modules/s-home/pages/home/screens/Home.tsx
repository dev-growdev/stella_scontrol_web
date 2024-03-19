import { Grid, Typography } from '@mui/material';
import { useAppSelector } from 'app/store';
import { selectUser } from 'app/store/user/userSlice';

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
		>
			{user &&
				user.modules.map(module => (
					<Grid
						item
						xs={12}
						sx={{ backgroundColor: '#00B2D01A' }}
						className="cursor-pointer flex justify-center items-center"
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

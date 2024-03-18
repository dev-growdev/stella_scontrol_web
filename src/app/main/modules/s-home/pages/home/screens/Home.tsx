import { Grid, Typography } from '@mui/material';
import { useAppSelector } from 'app/store';
import { selectUser } from 'app/store/user/userSlice';

export default function Home() {
	const user = useAppSelector(selectUser);

	function handleNavigate(module: string) {
		window.location.href = `/${module}`;
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
						className="bg-grey-400 cursor-pointer hover:bg-grey-600"
						key={module}
						onClick={() => handleNavigate(module)}
					>
						<Typography variant="h4">{module}</Typography>
					</Grid>
				))}
		</Grid>
	);
}

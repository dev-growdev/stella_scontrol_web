import { Box, Paper, Typography } from '@mui/material';

export default function Requests() {
	return (
		<Box className="flex flex-col w-full">
			<Paper
				elevation={4}
				className="p-28 m-32"
			>
				<Typography
					className="text-20 md:text-28"
					component="h1"
					variant="h4"
					fontWeight={500}
					sx={{ color: theme => theme.palette.secondary.main }}
				>
					Solicitações
				</Typography>
			</Paper>
		</Box>
	);
}

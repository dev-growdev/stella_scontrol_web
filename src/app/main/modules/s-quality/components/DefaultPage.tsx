import { Box, Paper } from '@mui/material';

interface PropsDefaultPage {
	children: React.ReactNode;
}

export function DefaultPage({ children }: PropsDefaultPage) {
	return (
		<Box className="p-32 mt-20">
			<Paper
				elevation={4}
				className="mt-24 flex flex-col gap-24 py-16"
			>
				{children}
			</Paper>
		</Box>
	);
}

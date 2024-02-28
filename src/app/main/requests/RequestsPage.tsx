import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, Paper, Typography } from '@mui/material';

export default function RequestsPage() {
	return (
		<Box className="flex flex-col w-full">
			<div className="p-32 mt-20">
				<Button
					className="mb-12"
					variant="text"
					startIcon={<FuseSvgIcon>material-twotone:arrow_back_ios</FuseSvgIcon>}
				>
					VOLTAR
				</Button>

				<Paper
					elevation={4}
					className="p-28"
				>
					<Typography
						className="text-20 md:text-28"
						component="h1"
						variant="h4"
						fontWeight={400}
					>
						Solicitações
					</Typography>
				</Paper>
			</div>
		</Box>
	);
}

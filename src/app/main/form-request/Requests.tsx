import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { selectUser } from 'app/store/user/userSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import RequestsTable from '../../components/RequestsTable';
import { listRequestsPaymentsByUser, selectedRequestPaymentGeneral } from './FormRequestSlice';

export default function Requests() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);
	const requests = useSelector(selectedRequestPaymentGeneral);

	useEffect(() => {
		dispatch(listRequestsPaymentsByUser(user.uid));
	}, []);

	return (
		<Box className="flex flex-col w-full ">
			<div className="p-32 mt-20">
				<Button
					className="mb-12"
					variant="text"
					color="primary"
					onClick={() => navigate('/solicitar-pagamento')}
					startIcon={<FuseSvgIcon>material-twotone:arrow_back_ios</FuseSvgIcon>}
				>
					ABRIR NOVA SOLICITAÇÃO
				</Button>
				<Paper
					elevation={4}
					className="p-28"
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
				<RequestsTable rows={requests.requests} />
			</div>
		</Box>
	);
}

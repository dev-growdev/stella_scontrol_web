import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useAppSelector } from 'app/store';
import { selectUser } from 'app/store/user/userSlice';
import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import RequestsTable from '../../../components/requests-table/RequestsTable';
import { useDispatchSControl, useSelectorSControl } from '../../../store/hooks';
import { listRequestsPaymentsByUser, selectedRequestPaymentGeneral } from '../store/FormRequestSlice';
import SearchFilter from './components/SearchFilter';
import { ISearchFilter } from './types/FilterSearch';

export default function Requests() {
	const navigate = useNavigate();
	const dispatch = useDispatchSControl();
	const user = useAppSelector(selectUser);
	const requests = useSelectorSControl(selectedRequestPaymentGeneral);

	const [searchFilters, setSearchFilters] = useState<ISearchFilter | null>(null);

	const [openSearchFilter, setOpenSearchFilter] = useState(false);

	const toggleDrawer = (open: boolean) => (event: MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
		if (
			event.type === 'keydown' &&
			((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setOpenSearchFilter(open);
	};

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
					onClick={() => navigate('cadastro')}
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

				<div className="w-full flex justify-end mt-32">
					<Button
						variant="contained"
						onClick={toggleDrawer(true)}
						startIcon={<FuseSvgIcon className="">heroicons-outline:filter</FuseSvgIcon>}
					>
						Filtros
					</Button>
				</div>

				<RequestsTable
					searchFilters={searchFilters}
					rows={requests.payload}
				/>
			</div>

			<SearchFilter
				open={openSearchFilter}
				toggleDrawer={toggleDrawer}
				filters={setSearchFilters}
			/>
		</Box>
	);
}

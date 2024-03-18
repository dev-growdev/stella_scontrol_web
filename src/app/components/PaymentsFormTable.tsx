import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	InputAdornment,
	Menu,
	MenuItem,
	Stack,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Toolbar,
	styled
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { HolderType, PaymentForm, PaymentsFormType } from '../main/payments-form/PaymentsFormSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		color: theme.palette.secondary.dark
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
		color: theme.palette.secondary.dark
	}
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.common.white
	},
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover
	},

	'&:last-child td, &:last-child th': {
		border: 0
	}
}));

interface PaymentFormTable {
	paymentsFormData: PaymentsFormType | { paymentsForm: []; loading: false };
	handleStatus: (item: PaymentForm | HolderType) => void;
}

export interface formatedPaymentsArray {
	uid: string;
	code: number;
	formaDePagamento: string;
	portador: string;
	uidPortador: string;
	enable: boolean;
}

export default function PaymentsFormTable({ paymentsFormData, handleStatus }: PaymentFormTable) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchValue, setSearchValue] = useState('');
	const [filterByStatus, setFilterByStatus] = useState<'all' | 'active' | 'inactive'>('all');
	const [anchorStatusMenu, setAnchorStatusMenu] = useState<null | HTMLElement>(null);

	const openMenuStatus = Boolean(anchorStatusMenu);

	const filteredPayments: PaymentForm[] | HolderType[] =
		paymentsFormData.paymentsForm && paymentsFormData.paymentsForm.length > 0
			? paymentsFormData.paymentsForm.filter((row: PaymentForm | HolderType) => {
					const matchSearch =
						!searchValue || (row as PaymentForm).name.toLowerCase().includes(searchValue.toLowerCase());
					const matchStatus =
						filterByStatus === 'all' ||
						(filterByStatus === 'active' && row.enable) ||
						(filterByStatus === 'inactive' && !row.enable);
					return matchSearch && matchStatus;
			  })
			: [];

	const sortedPayments = filteredPayments.slice().reverse();

	const handleChangePage = (_event: MouseEvent, value: number) => {
		setPage(value);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
		setPage(0);
	};

	const handleOpenStatusMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorStatusMenu(event.currentTarget);
	};

	const handleCloseStatusMenu = (value?: 'all' | 'active' | 'inactive') => {
		if (typeof value === 'string') {
			setFilterByStatus(value);
		} else {
			setFilterByStatus(filterByStatus);
		}
		setAnchorStatusMenu(null);
		setPage(0);
	};

	return (
		<Box className="w-full">
			<Toolbar>
				<div className="flex flex-row sm:flex-row w-full items-center gap-24 justify-end py-24">
					<TextField
						onChange={handleSearch}
						value={searchValue}
						label="Pesquisar"
						fullWidth
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<FuseSvgIcon color="primary">heroicons-outline:search</FuseSvgIcon>
								</InputAdornment>
							)
						}}
					/>

					<div>
						<Button
							id="basic-button"
							aria-controls={openMenuStatus ? 'basic-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={openMenuStatus ? 'true' : undefined}
							onClick={handleOpenStatusMenu}
							className="w-full sm:w-144 "
							variant="contained"
							startIcon={<FuseSvgIcon className="">heroicons-outline:filter</FuseSvgIcon>}
						>
							{filterByStatus === 'all' && 'FILTRAR'}
							{filterByStatus === 'active' && 'ATIVOS'}
							{filterByStatus === 'inactive' && 'INATIVOS'}
						</Button>

						<Menu
							id="basic-menu"
							anchorEl={anchorStatusMenu}
							open={openMenuStatus}
							onClose={handleCloseStatusMenu}
							MenuListProps={{
								'aria-labelledby': 'basic-button'
							}}
						>
							<MenuItem onClick={() => handleCloseStatusMenu('all')}>Todos</MenuItem>
							<MenuItem onClick={() => handleCloseStatusMenu('active')}>Ativos</MenuItem>
							<MenuItem onClick={() => handleCloseStatusMenu('inactive')}>Inativos</MenuItem>
						</Menu>
					</div>
				</div>
			</Toolbar>

			<TableContainer>
				<Table>
					<TableHead
						className="flex justify-between font-600"
						sx={{ backgroundColor: theme => theme.palette.action.hover }}
					>
						<StyledTableCell>Código</StyledTableCell>
						<StyledTableCell>Forma de Pagamento</StyledTableCell>
						<StyledTableCell>Portador</StyledTableCell>
						<StyledTableCell>Status</StyledTableCell>
						<StyledTableCell>Ações</StyledTableCell>
					</TableHead>
					<TableBody>
						{paymentsFormData.loading ? (
							<Box className="flex justify-center items-center">
								<CircularProgress color="primary" />
							</Box>
						) : (
							sortedPayments
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row: PaymentForm | HolderType) => (
									<StyledTableRow
										className="flex justify-between"
										key={row.uid}
									>
										<StyledTableCell className="w-[24.5rem]">
											{(row as HolderType).code || row.code
												? (row as HolderType).code ?? row.code
												: '-'}
										</StyledTableCell>

										<StyledTableCell className="w-[34rem]">
											{(row as HolderType).namePaymentForm ?? row.name}
										</StyledTableCell>

										<StyledTableCell className="w-88 flex justify-center">
											{(row as HolderType).type ? row.name : ''}
										</StyledTableCell>

										<StyledTableCell className="min-w-256 flex justify-end">
											<Stack
												direction="row"
												spacing={1}
											>
												<Chip
													className="min-w-64 text-center"
													color={row.enable ? 'primary' : 'default'}
													sx={{
														color: row.enable
															? theme => theme.palette.common.white
															: theme => theme.palette.secondary.light
													}}
													label={row.enable ? 'Ativo' : 'Inativo'}
												/>
											</Stack>
										</StyledTableCell>
										<StyledTableCell className="min-w-224 flex justify-end">
											<div className="flex w-full justify-end">
												<FormGroup>
													<FormControlLabel
														control={
															<Switch
																color="primary"
																name="enable"
																checked={!!row.enable}
																onChange={() => handleStatus(row)}
															/>
														}
														label={row.enable ? 'Inativar' : 'Ativar'}
													/>
												</FormGroup>
											</div>
										</StyledTableCell>
									</StyledTableRow>
								))
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={sortedPayments.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelRowsPerPage="Formas de pagamento por página:"
			/>
		</Box>
	);
}

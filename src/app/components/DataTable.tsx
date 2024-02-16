import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Button,
	Chip,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	Menu,
	MenuItem,
	Stack,
	Switch,
	TableBody,
	TableHead,
	TableRow,
	TextField
} from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { CategoriesType, Category } from '../main/categories/categoriesSlice';

interface EnhancedTableProps {
	selectItem?: (item: Category) => void;
	categoriesData: CategoriesType | { categories: []; loading: false };
	editMode: boolean;
	setEditMode?: (arg: boolean) => void;
	handleStatus?: (item: Category) => void;
}

export default function EnhancedTable({
	setEditMode,
	selectItem,
	categoriesData,
	editMode,
	handleStatus
}: EnhancedTableProps) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [searchValue, setSearchValue] = React.useState('');
	const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
	const [filterByStatus, setFilterByStatus] = React.useState<'all' | 'active' | 'inactive'>('all');
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	React.useEffect(() => {
		if (editMode === false) {
			setSelectedItemId(null);
		}
	}, [editMode]);

	React.useEffect(() => {
		if (selectedItemId === null) {
			setEditMode(false);
		}
	}, [selectedItemId]);

	React.useEffect(() => {
		if (selectedItemId !== null) {
			const findItem = categoriesData.categories.find(item => item.uid === selectedItemId);
			selectItem(findItem);
		}
	}, [selectedItemId]);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleRowClick = (itemId: string) => {
		setSelectedItemId(itemId === selectedItemId ? null : itemId);
	};

	const filteredRows: Category[] = categoriesData.categories.filter(row => {
		const matchesSearch = !searchValue || row.name.toLowerCase().includes(searchValue.toLowerCase());
		const matchesStatus =
			filterByStatus === 'all' ||
			(filterByStatus === 'active' && row.enable) ||
			(filterByStatus === 'inactive' && !row.enable);
		return matchesSearch && matchesStatus;
	});

	const sortedRows = filteredRows.slice().reverse();

	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (value?: 'all' | 'active' | 'inactive') => {
		value && setFilterByStatus(value);
		setAnchorEl(null);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<Toolbar>
					<div className="flex flex-col sm:flex-row w-full items-center gap-24">
						<Typography
							variant="h6"
							component="div"
						>
							Categorias cadastradas
						</Typography>
						<TextField
							onChange={handleSearch}
							value={searchValue}
							label="Pesquise por categorias"
							fullWidth
						/>
						<div>
							<Button
								onClick={handleClick}
								id="basic-button"
								aria-controls={open ? 'basic-menu' : undefined}
								aria-haspopup="true"
								aria-expanded={open ? 'true' : undefined}
								className="w-full sm:w-144 pl-60 pr-64"
								sx={{ borderRadius: '7px' }}
								variant="contained"
								startIcon={<FuseSvgIcon>heroicons-outline:filter</FuseSvgIcon>}
							>
								{filterByStatus === 'all' && 'FILTRAR'}
								{filterByStatus === 'active' && 'ATIVOS'}
								{filterByStatus === 'inactive' && 'INATIVOS'}
							</Button>
							<Menu
								id="basic-menu"
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								MenuListProps={{
									'aria-labelledby': 'basic-button'
								}}
							>
								<MenuItem onClick={() => handleClose('all')}>Todos</MenuItem>
								<MenuItem onClick={() => handleClose('active')}>Ativos</MenuItem>
								<MenuItem onClick={() => handleClose('inactive')}>Inativos</MenuItem>
							</Menu>
						</div>
					</div>
				</Toolbar>
				<TableContainer>
					<Table>
						<TableHead className="flex justify-between">
							<TableCell>Nome</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Ações</TableCell>
						</TableHead>
						<TableBody>
							{categoriesData.loading ? (
								<Box className="flex justify-center items-center">
									<CircularProgress color="primary" />
								</Box>
							) : (
								sortedRows
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => (
										<TableRow
											className="flex justify-between"
											key={row.uid}
										>
											<TableCell
												component="th"
												scope="row"
											>
												{row.name}
											</TableCell>

											<TableCell className="min-w-160 flex justify-end">
												<Stack
													direction="row"
													spacing={1}
												>
													<Chip
														sx={{ minWidth: '100px' }}
														color={row.enable ? 'primary' : 'error'}
														label={row.enable ? 'Ativo' : 'Inativo'}
													/>
												</Stack>
											</TableCell>
											<TableCell
												className="min-w-224 flex justify-end"
												sx={{
													color: theme => theme.palette.secondary.light
												}}
											>
												<div className="flex w-full justify-between">
													<div
														onClick={() => handleRowClick(row.uid)}
														className="w-32 mr-20 "
													>
														<FuseSvgIcon
															sx={{
																cursor: 'pointer'
															}}
														>
															heroicons-outline:pencil
														</FuseSvgIcon>
													</div>
													<FormGroup>
														<FormControlLabel
															control={
																<Switch
																	name="enable"
																	checked={row.enable ? true : false}
																	onChange={e => handleStatus(row)}
																/>
															}
															label={row.enable ? 'Inativar' : 'Ativar'}
														/>
													</FormGroup>
												</div>
											</TableCell>
										</TableRow>
									))
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={sortedRows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelRowsPerPage="Categorias por página:"
				/>
			</Paper>
		</Box>
	);
}

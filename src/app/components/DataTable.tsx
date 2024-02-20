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
import { ChangeEvent, useEffect, useState } from 'react';
import { CategoriesType, Category } from '../main/categories/categoriesSlice';

interface DataTableProps {
	selectItem: (item: Category | null) => void;
	categoriesData: CategoriesType | { categories: []; loading: false };
	handleStatus?: (item: Category) => void;
}

export default function DataTable({ selectItem, categoriesData, handleStatus }: DataTableProps) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchValue, setSearchValue] = useState('');
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [filterByStatus, setFilterByStatus] = useState<'all' | 'active' | 'inactive'>('all');
	const [anchorStatusMenu, setAnchorStatusMenu] = useState<null | HTMLElement>(null);

	const openMenuStatus = Boolean(anchorStatusMenu);

	useEffect(() => {
		if (selectedItemId !== null && categoriesData.categories) {
			const findItem = categoriesData.categories.find(item => item.uid === selectedItemId);
			selectItem(findItem || null);
		} else {
			selectItem(null);
		}
	}, [selectedItemId, categoriesData.categories]);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleRowEdit = (itemId: string) => {
		setSelectedItemId(itemId === selectedItemId ? null : itemId);
	};

	const filteredCategories: Category[] =
		categoriesData.categories && categoriesData.categories.length > 0
			? categoriesData.categories.filter((row: Category) => {
					const matchesSearch = !searchValue || row.name.toLowerCase().includes(searchValue.toLowerCase());
					const matchesStatus =
						filterByStatus === 'all' ||
						(filterByStatus === 'active' && row.enable) ||
						(filterByStatus === 'inactive' && !row.enable);
					return matchesSearch && matchesStatus;
			  })
			: [];

	const sortedCategories = filteredCategories.slice().reverse();

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
	};

	function handleToggleStatusCategory(category: Category) {
		handleStatus(category);
	}

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
								id="basic-button"
								aria-controls={openMenuStatus ? 'basic-menu' : undefined}
								aria-haspopup="true"
								aria-expanded={openMenuStatus ? 'true' : undefined}
								onClick={handleOpenStatusMenu}
								className="w-full sm:w-144 pl-60 pr-64"
								variant="contained"
								startIcon={<FuseSvgIcon>heroicons-outline:filter</FuseSvgIcon>}
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
								sortedCategories
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map(row => (
										<TableRow
											className="flex justify-between"
											key={row.uid}
										>
											<TableCell
												className="min-w-160"
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
														className="min-w-64"
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
													<FuseSvgIcon
														className="w-32 mr-20 cursor-pointer"
														onClick={() => handleRowEdit(row.uid)}
													>
														heroicons-outline:pencil
													</FuseSvgIcon>

													<FormGroup>
														<FormControlLabel
															control={
																<Switch
																	name="enable"
																	checked={row.enable}
																	onChange={() => handleToggleStatusCategory(row)}
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
					count={sortedCategories.length}
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
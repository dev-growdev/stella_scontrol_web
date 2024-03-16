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
	TableContainer,
	TableHead,
	TablePagination,
	TextField,
	Toolbar
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { CategoriesType, CategoryType } from '../../categories/entities/category';
import { StyledTableCell, StyledTableRow } from './styles';

interface DataTableProps {
	selectItem: (item: CategoryType | null) => void;
	categoriesData: CategoriesType;
	handleStatus?: (item: CategoryType) => void;
}

export function DataTable({ selectItem, categoriesData, handleStatus }: DataTableProps) {
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

	const handleChangePage = (_: unknown, newPage: number) => {
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

	const filteredCategories: CategoryType[] =
		categoriesData.categories && categoriesData.categories.length > 0
			? categoriesData.categories.filter((row: CategoryType) => {
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

	function handleToggleStatusCategory(category: CategoryType) {
		handleStatus(category);
	}

	return (
		<Box sx={{ width: '100%' }}>
			<Toolbar>
				<div className="flex justify-end flex-col sm:flex-row w-full items-center gap-24">
					<TextField
						className="sm:w-512"
						onChange={handleSearch}
						value={searchValue}
						label="Pesquise por categoria"
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
			<TableContainer className="mt-28">
				<Table>
					<TableHead
						className="flex justify-between font-600"
						sx={{ backgroundColor: theme => theme.palette.action.hover }}
					>
						<StyledTableCell>Nome</StyledTableCell>
						<StyledTableCell>Status</StyledTableCell>
						<StyledTableCell>Ações</StyledTableCell>
					</TableHead>
					<TableBody>
						{categoriesData.loading ? (
							<Box className="flex justify-center items-center">
								<CircularProgress color="primary" />
							</Box>
						) : (
							sortedCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
								<StyledTableRow
									className="flex justify-between"
									key={row.uid}
								>
									<StyledTableCell
										className="min-w-160"
										component="th"
										scope="row"
									>
										{row.name}
									</StyledTableCell>

									<StyledTableCell className="min-w-160 flex justify-end">
										<Stack
											direction="row"
											spacing={1}
										>
											<Chip
												className="min-w-64"
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
									<StyledTableCell
										className="min-w-224 flex justify-end"
										sx={{
											color: theme => theme.palette.secondary.light
										}}
									>
										<div className="flex w-full justify-between">
											<FuseSvgIcon
												className="w-32 mr-20 cursor-pointer"
												color="primary"
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
															color="primary"
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
				count={sortedCategories.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelRowsPerPage="Categorias por página:"
			/>
		</Box>
	);
}

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	FormControlLabel,
	FormGroup,
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
	Typography
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { Product, ProductsType } from '../main/products/productsSlice';

interface ProductTableProps {
	selectItem: (item: Product | null) => void;
	productsData: ProductsType | { products: []; loading: false };
	handleStatus: (item: Product) => void;
}

export default function ProductTable({ selectItem, productsData, handleStatus }: ProductTableProps) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchValue, setSearchValue] = useState('');
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [filterByStatus, setFilterByStatus] = useState<'all' | 'active' | 'inactive'>('all');
	const [anchorStatusMenu, setAnchorStatusMenu] = useState<null | HTMLElement>(null);

	const openMenuStatus = Boolean(anchorStatusMenu);

	useEffect(() => {
		if (selectedItemId !== null && productsData.products) {
			const findItem = productsData.products.find(item => item.uid === selectedItemId);
			selectItem(findItem || null);
		}
	}, [selectedItemId, productsData.products]);

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

	const handleRowClick = (itemId: string) => {
		setSelectedItemId(itemId === selectedItemId ? null : itemId);
	};

	const filteredProducts: Product[] =
		productsData.products && productsData.products.length > 0
			? productsData.products.filter((row: Product) => {
					const matchesSearch = !searchValue || row.name.toLowerCase().includes(searchValue.toLowerCase());
					const matchesStatus =
						filterByStatus === 'all' ||
						(filterByStatus === 'active' && row.enable) ||
						(filterByStatus === 'inactive' && !row.enable);

					return matchesSearch && matchesStatus;
			  })
			: [];

	const sortedProducts = filteredProducts.slice().reverse();

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

	return (
		<Box sx={{ width: '100%' }}>
			<Toolbar>
				<div className="flex flex-col sm:flex-row w-full items-center gap-24">
					<Typography
						variant="h6"
						component="div"
					>
						Produtos cadastrados
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
						<TableCell>Categoria</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Ações</TableCell>
					</TableHead>
					<TableBody>
						{productsData.loading ? (
							<Box className="flex justify-center items-center">
								<CircularProgress color="primary" />
							</Box>
						) : (
							sortedProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
								<TableRow
									className="flex justify-between"
									key={row.uid}
								>
									<TableCell
										className="min-w-200"
										component="th"
										scope="row"
									>
										{row.name}
									</TableCell>

									<TableCell className="min-w-200 flex justify-center">{row.category.name}</TableCell>
									<TableCell className="min-w-200 flex justify-end">
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
												onClick={() => handleRowClick(row.uid)}
												className="w-32 mr-20 cursor-pointer"
											>
												heroicons-outline:pencil
											</FuseSvgIcon>

											<FormGroup>
												<FormControlLabel
													control={
														<Switch
															color="primary"
															name="enable"
															checked={row.enable}
															onChange={() => handleStatus(row)}
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
				count={sortedProducts.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelRowsPerPage="Categorias por página:"
			/>
		</Box>
	);
}

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	InputAdornment,
	Stack,
	Switch,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TablePagination,
	TextField,
	Toolbar,
	Typography
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ProductType, ProductsType } from '../../pages/products/types/product';
import { StyledTableCell, StyledTableRow } from '../tableStyles';

interface ProductTableProps {
	selectItem: (item: ProductType | null) => void;
	productsData: ProductsType;
	handleStatus: (item: ProductType) => void;
}

export function ProductTable({ selectItem, productsData, handleStatus }: ProductTableProps) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchValue, setSearchValue] = useState('');
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (selectedItemId !== null && productsData.products) {
			const findItem = productsData.products.find(item => item.uid === selectedItemId);
			selectItem(findItem || null);
		}
	}, [selectedItemId, productsData.products]);

	const handleChangePage = (_, newPage: number) => {
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

	const filteredProducts: ProductType[] =
		productsData.products && productsData.products.length > 0
			? productsData.products.filter((row: ProductType) => {
					const matchesSearch = !searchValue || row.name.toLowerCase().includes(searchValue.toLowerCase());
					return matchesSearch;
			  })
			: [];

	const sortedProducts = filteredProducts.slice().reverse();

	const handleNavigateCreateProduct = () => {
		navigate('cadastro');
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Toolbar>
				<div className="flex flex-col sm:flex-row w-full items-center gap-24 justify-between mb-32 mt-10">
					<Typography
						className="text-20 md:text-28"
						component="h1"
						variant="h4"
						fontWeight={500}
						color={theme => theme.palette.secondary.main}
					>
						Produtos
					</Typography>
					<Button
						id="basic-button"
						aria-haspopup="true"
						className="w-full sm:w-256 shadow-lg py-24"
						variant="contained"
						startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
						onClick={handleNavigateCreateProduct}
					>
						Cadastro de novo produto
					</Button>
				</div>
			</Toolbar>
			<Toolbar>
				<div className="flex flex-row sm:flex-row w-full items-center gap-24 justify-end  mb-32">
					<TextField
						onChange={handleSearch}
						value={searchValue}
						className="sm:w-512"
						label="Pesquise por produtos"
						fullWidth
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<FuseSvgIcon color="primary">heroicons-outline:search</FuseSvgIcon>
								</InputAdornment>
							)
						}}
					/>
				</div>
			</Toolbar>
			<TableContainer>
				<Table>
					<TableHead
						className="flex justify-between font-600"
						sx={{ backgroundColor: theme => theme.palette.action.hover }}
					>
						<StyledTableCell>Código</StyledTableCell>
						<StyledTableCell>Nome</StyledTableCell>
						<StyledTableCell>Categoria</StyledTableCell>
						<StyledTableCell>UN</StyledTableCell>
						<StyledTableCell>Qtde Embalagem</StyledTableCell>
						<StyledTableCell>Status</StyledTableCell>
						<StyledTableCell>Ações</StyledTableCell>
					</TableHead>
					<TableBody>
						{productsData.loading ? (
							<Box className="flex justify-center items-center">
								<CircularProgress color="primary" />
							</Box>
						) : (
							sortedProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
								<StyledTableRow
									className="flex justify-between"
									key={row.uid}
								>
									<StyledTableCell
										className="w-[25rem] break-words"
										component="th"
										scope="row"
									>
										{row.code}
									</StyledTableCell>

									<StyledTableCell
										className="w-[24rem] break-words"
										component="th"
										scope="row"
									>
										{row.name}
									</StyledTableCell>

									<StyledTableCell
										className="w-[27rem] break-words"
										component="th"
										scope="row"
									>
										{row.category.name}
									</StyledTableCell>

									<StyledTableCell
										className="w-[22rem] break-words"
										component="th"
										scope="row"
									>
										{!row.measurement ? '-' : row.measurement}
									</StyledTableCell>

									<StyledTableCell
										className="w-[31rem] break-words"
										component="th"
										scope="row"
									>
										{row.quantity === 0 ? '-' : row.quantity}
									</StyledTableCell>

									<StyledTableCell className="w-[12rem] justify-end">
										<Stack
											direction="row"
											spacing={1}
										>
											<Chip
												className="min-w-68 justify-center"
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
									<StyledTableCell className="min-w-208 flex justify-end">
										<div className="flex w-full justify-between">
											<FuseSvgIcon
												color="primary"
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
				count={sortedProducts.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelRowsPerPage="Produtos por página:"
			/>
		</Box>
	);
}

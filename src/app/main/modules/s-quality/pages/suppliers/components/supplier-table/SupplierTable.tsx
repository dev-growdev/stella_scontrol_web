import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Box,
	Button,
	InputAdornment,
	Table,
	TableContainer,
	TableHead,
	TextField,
	Toolbar,
	Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { StyledTableCell } from './tableStyles';
import { ISupplier } from '../../types/suppliers';

interface SupplierTableProps {
	/* selectItem: (item: ISupplierType | null) => void; */
	suppliersData: ISupplier;
	/* handleStatus: (item: ISupplierType) => void; */
}

export function SupplierTable({ suppliersData }: SupplierTableProps) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchValue, setSearchValue] = useState('');
	/* const [selectedItemId, setSelectedItemId] = useState<string | null>(null); */

	const navigate = useNavigate();

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
						Fornecedores
					</Typography>
					<Button
						id="basic-button"
						aria-haspopup="true"
						className="w-full sm:w-256 shadow-lg py-24"
						variant="contained"
						startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
						/* onClick={handleNavigateCreateProduct} */
					>
						Cadastro de novo fornecedor
					</Button>
				</div>
			</Toolbar>
			<Toolbar>
				<div className="flex flex-row sm:flex-row w-full items-center gap-24 justify-end  mb-32">
					<TextField
						/* onChange={handleSearch} */
						value={searchValue}
						className="sm:w-512"
						label="Pesquise por fornecedores"
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
						<StyledTableCell>Nome</StyledTableCell>
						<StyledTableCell>Email</StyledTableCell>
						<StyledTableCell>Contato</StyledTableCell>
						<StyledTableCell>Telefone</StyledTableCell>
						<StyledTableCell>Endereço</StyledTableCell>
						<StyledTableCell>Ativo</StyledTableCell>
					</TableHead>
					<TableContainer />
				</Table>
			</TableContainer>
			{/* <TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={sortedProducts.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelRowsPerPage="Fornecedores por página:"
			/> */}
		</Box>
	);
}

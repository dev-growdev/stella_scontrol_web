import { Box, Table, TableContainer, TableHead } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { StyledTableCell } from './tableStyles';
import { ISupplier } from '~/modules/s-quality/pages/suppliers/types/suppliers';

interface SupplierTableProps {
	/* selectItem: (item: ISupplierType | null) => void; */
	suppliersData: ISupplier[];
	/* handleStatus: (item: ISupplierType) => void; */
}

export function SupplierTable({ suppliersData }: SupplierTableProps) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	/* const [selectedItemId, setSelectedItemId] = useState<string | null>(null); */

	const navigate = useNavigate();

	return (
		<Box sx={{ width: '100%' }}>
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

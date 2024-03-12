import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip, Stack, styled, TableCell, tableCellClasses } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ChangeEvent, useState } from 'react';
import { RequestType } from '../main/form-request/FormRequestSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		color: theme.palette.secondary.dark,
		backgroundColor: theme.palette.action.hover
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

interface RequestTableProps {
	rows: RequestType[];
}

export default function RequestsTable({ rows }: RequestTableProps) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	function formatDate(dateParam: Date) {
		const date = new Date(dateParam);
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	return (
		<Paper
			className="mt-32"
			sx={{ width: '100%', overflow: 'hidden' }}
		>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table
					stickyHeader
					aria-label="sticky table"
				>
					<TableHead>
						<StyledTableCell>Tipo</StyledTableCell>
						<StyledTableCell>Status</StyledTableCell>
						<StyledTableCell>Data de cadastro</StyledTableCell>
						<StyledTableCell align="right">Ações</StyledTableCell>
					</TableHead>
					<TableBody>
						{Array.isArray(rows) &&
							rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								return (
									<StyledTableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={row.uid}
									>
										<StyledTableCell>
											{index % 2 === 0 ? 'Pagamento geral' : 'Compras'}
										</StyledTableCell>
										<StyledTableCell>
											<Stack
												direction="row"
												spacing={1}
											>
												<Chip
													color={index % 2 === 0 ? 'success' : 'primary'}
													label={index % 2 === 0 ? 'Concluído' : 'Em andamento'}
												/>
											</Stack>
										</StyledTableCell>
										<StyledTableCell>{formatDate(row.createdAt)}</StyledTableCell>
										<StyledTableCell className="flex gap-28 justify-end">
											<FuseSvgIcon color="primary">heroicons-outline:pencil</FuseSvgIcon>
											<FuseSvgIcon color="primary">heroicons-outline:eye</FuseSvgIcon>
										</StyledTableCell>
									</StyledTableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				labelRowsPerPage="Linhas por página"
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

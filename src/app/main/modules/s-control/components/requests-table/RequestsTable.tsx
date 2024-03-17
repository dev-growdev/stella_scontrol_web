import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip, Stack, Paper, Table, TableBody, TableContainer, TableHead, TablePagination } from '@mui/material';

import { ChangeEvent, useState } from 'react';
import { StyledTableCell, StyledTableRow } from './styles';
import { RequestType } from '../../form-request/entities/request';

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

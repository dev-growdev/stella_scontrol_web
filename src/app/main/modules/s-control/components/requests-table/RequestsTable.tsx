import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip, Paper, Stack, Table, TableBody, TableContainer, TableHead, TablePagination } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import { IRequestPaymentGeneral } from '../../pages/form-request/types/request';
import { formattedNumeral } from '../../utils/formatters/formatted-value';
import { StyledTableCell, StyledTableRow } from './styles';

interface RequestTableProps {
	rows: IRequestPaymentGeneral[];
}

export default function RequestsTable({ rows }: RequestTableProps) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const navigate = useNavigate();

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

	function handleEditPaymentRequest(uid: string) {
		navigate(`cadastro/${uid}/edit`);
	}
	function handleReadPaymentRequest(uid: string) {
		navigate(`cadastro/${uid}`);
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
						<StyledTableCell>Fornecedor</StyledTableCell>
						<StyledTableCell>Valor</StyledTableCell>
						<StyledTableCell>Data de cadastro</StyledTableCell>
						<StyledTableCell>Data de vencimento</StyledTableCell>
						<StyledTableCell align="right">Ações</StyledTableCell>
					</TableHead>
					<TableBody>
						{Array.isArray(rows) &&
							rows
								.slice()
								.reverse()
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
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
											<StyledTableCell>{row.supplier}</StyledTableCell>
											<StyledTableCell>
												R${formattedNumeral(parseFloat(row.totalValue))}
											</StyledTableCell>
											<StyledTableCell>{formatDate(row.createdAt)}</StyledTableCell>
											<StyledTableCell>{formatDate(row.payments[0].dueDate)}</StyledTableCell>

											<StyledTableCell className="flex gap-28 justify-end">
												<FuseSvgIcon
													className="cursor-pointer"
													onClick={() => handleEditPaymentRequest(row.uid)}
													color="primary"
												>
													heroicons-outline:pencil
												</FuseSvgIcon>
												<FuseSvgIcon
													className="cursor-pointer"
													onClick={() => handleReadPaymentRequest(row.uid)}
													color="primary"
												>
													heroicons-outline:eye
												</FuseSvgIcon>
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

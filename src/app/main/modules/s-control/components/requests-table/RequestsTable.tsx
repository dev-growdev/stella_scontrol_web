import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip, Paper, Stack, Table, TableBody, TableContainer, TableHead, TablePagination } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import { ISearchFilter } from '../../pages/form-request/screens/types/FilterSearch';
import { IRequestPaymentGeneral } from '../../pages/form-request/types/requestPaymentsGeneral';
import { formattedNumeral } from '../../utils/formatters/formatted-value';
import { StyledTableCell, StyledTableRow } from './styles';

interface RequestTableProps {
	rows: IRequestPaymentGeneral[];
	searchFilters: ISearchFilter | null;
}

export default function RequestsTable({ rows, searchFilters }: RequestTableProps) {
	const navigate = useNavigate();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (_, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const validateData = (value: number) => {
		if (value < 10) {
			return `0${value}`;
		}
		return value;
	};

	function formatDate(dateParam: Date) {
		const date = new Date(dateParam);
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		return `${validateData(day)}/${validateData(month)}/${year}`;
	}

	function handleEditPaymentRequest(uid: string) {
		navigate(`cadastro/${uid}/edit`);
	}

	function handleReadPaymentRequest(uid: string) {
		navigate(`cadastro/${uid}`);
	}

	function filterRows(row: IRequestPaymentGeneral, filters: ISearchFilter | null, index: number) {
		const {
			supplier,
			type,
			status,
			createdAt: { from: createdAtFrom, to: createdAtTo },
			dueDate: { from: dueDateFrom, to: dueDateTo }
		} = filters || {};

		const rowWithMockTypeAndStatus = {
			...row,
			type: index % 2 === 0 ? 'Pagamento geral' : 'Compras',
			status: index % 2 === 0 ? 'Concluído' : 'Em andamento'
		};

		const createdAtFromDate = createdAtFrom ? new Date(createdAtFrom) : null;
		const createdAtToDate = createdAtTo ? new Date(createdAtTo) : null;

		const dueDateFromDate = dueDateFrom ? new Date(dueDateFrom) : null;
		const dueDateToDate = dueDateTo ? new Date(dueDateTo) : null;

		const isDateInRange = (date: Date, fromDate: Date, toDate: Date) => {
			if (fromDate && toDate) {
				const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
				const fromDateWithoutTime = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
				const toDateWithoutTime = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

				return dateWithoutTime >= fromDateWithoutTime && dateWithoutTime <= toDateWithoutTime;
			}
			if (fromDate) {
				const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
				const fromDateWithoutTime = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
				return dateWithoutTime.getTime() === fromDateWithoutTime.getTime();
			}

			if (toDate) {
				const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
				const toDateWithoutTime = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
				return dateWithoutTime.getTime() <= toDateWithoutTime.getTime();
			}

			return true;
		};

		const isAllFiltersEmpty =
			!supplier &&
			type.length === 0 &&
			status.length === 0 &&
			!createdAtFrom &&
			!createdAtTo &&
			!dueDateFrom &&
			!dueDateTo;
		return (
			isAllFiltersEmpty ||
			((!supplier || rowWithMockTypeAndStatus.supplier.toLowerCase().includes(supplier.toLowerCase())) &&
				(type.length === 0 || type.includes(rowWithMockTypeAndStatus.type)) &&
				(status.length === 0 || status.includes(rowWithMockTypeAndStatus.status)) &&
				isDateInRange(new Date(rowWithMockTypeAndStatus.createdAt), createdAtFromDate, createdAtToDate) &&
				isDateInRange(new Date(rowWithMockTypeAndStatus.payments[0].dueDate), dueDateFromDate, dueDateToDate))
		);
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
									if (!searchFilters || filterRows(row, searchFilters, index)) {
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
									}
									return null;
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

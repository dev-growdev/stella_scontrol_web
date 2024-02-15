import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip, Stack, TableHead, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Category } from '../main/categories/categoriesSlice';

interface EnhancedTableProps {
	selectItem?: (item: Category) => void;
	categoriesData?: Category[];
	editMode: boolean;
	setEditMode?: (arg: boolean) => void;
}

export default function EnhancedTable({ setEditMode, selectItem, categoriesData, editMode }: EnhancedTableProps) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [searchValue, setSearchValue] = React.useState('');
	const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (editMode === false) {
			setSelectedItemId(null);
		}
	}, [editMode]);

	React.useEffect(() => {
		if (selectedItemId === null) {
			setEditMode(false);
		}
	}, [selectedItemId]);

	React.useEffect(() => {
		if (selectedItemId !== null) {
			const findItem = categoriesData.find(item => item.uid === selectedItemId);
			selectItem(findItem);
		}
	}, [selectedItemId]);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleRowClick = (itemId: string) => {
		setSelectedItemId(itemId === selectedItemId ? null : itemId);
	};

	const filteredRows = searchValue
		? categoriesData.filter(row => row.name.toLowerCase().includes(searchValue.toLowerCase()))
		: categoriesData;

	const sortedRows = filteredRows.slice().reverse();

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<Toolbar>
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
				</Toolbar>
				<TableContainer>
					<Table>
						<TableHead>
							<TableCell>Nome</TableCell>
							<TableCell>Data do cadastro</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Ações</TableCell>
						</TableHead>
						<TableBody>
							{sortedRows
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => (
									<TableRow
										key={row.uid}
										sx={{
											cursor: 'pointer',
											backgroundColor:
												row.uid === selectedItemId
													? theme => theme.palette.primary.main
													: 'inherit'
										}}
										onClick={() => handleRowClick(row.uid)}
									>
										<TableCell
											component="th"
											scope="row"
											sx={{
												color:
													row.uid === selectedItemId
														? theme => theme.palette.background.paper
														: 'inherit'
											}}
										>
											{row.name}
										</TableCell>
										<TableCell
											sx={{
												color:
													row.uid === selectedItemId
														? theme => theme.palette.background.paper
														: 'inherit'
											}}
										>{`${new Date(row.createdAt).getDate()}/${
											new Date(row.createdAt).getMonth() + 1
										}/${new Date(row.createdAt).getFullYear()}`}</TableCell>
										<TableCell
											sx={{
												color:
													row.uid === selectedItemId
														? theme => theme.palette.background.paper
														: 'inherit'
											}}
										>
											<Stack
												direction="row"
												spacing={1}
											>
												<Chip
													color={row.enable ? 'primary' : 'error'}
													label={row.enable ? 'Ativo' : 'Inativo'}
												/>
											</Stack>
										</TableCell>
										<TableCell
											sx={{
												color:
													row.uid === selectedItemId
														? theme => theme.palette.background.paper
														: theme => theme.palette.secondary.light
											}}
										>
											<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={sortedRows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
}

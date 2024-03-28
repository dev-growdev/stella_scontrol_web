import { Autocomplete, Button, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { Fragment, MouseEvent, useState } from 'react';
import { ISearchFilter } from '../types/FilterSearch';

interface PropsSearchFilter {
	toggleDrawer: (open: boolean) => (event: MouseEvent<HTMLButtonElement> | KeyboardEvent) => void;
	open: boolean;
	filters: (arg: ISearchFilter) => void;
}

export default function SearchFilter({ toggleDrawer, open, filters }: PropsSearchFilter) {
	const [filter, setFilter] = useState<ISearchFilter>({
		type: [],
		status: [],
		createdAt: { from: null, to: null },
		dueDate: { from: null, to: null },
		supplier: ''
	});

	function handleTypeRequestFilter(_, value: string[]) {
		setFilter(prevFilter => ({
			...prevFilter,
			type: value
		}));
	}
	function handleStatusRequestFilter(_, value: string[]) {
		setFilter(prevFilter => ({
			...prevFilter,
			status: value
		}));
	}

	function handleCreatedAtFromRequestFilter(value: Date) {
		setFilter(prevFilter => ({
			...prevFilter,
			createdAt: { ...prevFilter.createdAt, from: value }
		}));
	}

	function handleCreatedAtToRequestFilter(value: Date) {
		setFilter(prevFilter => ({
			...prevFilter,
			createdAt: { ...prevFilter.createdAt, to: value }
		}));
	}

	function handleDueDateFromRequestFilter(value: Date) {
		setFilter(prevFilter => ({
			...prevFilter,
			dueDate: { ...prevFilter.dueDate, from: value }
		}));
	}

	function handleDueDateToRequestFilter(value: Date) {
		setFilter(prevFilter => ({
			...prevFilter,
			dueDate: { ...prevFilter.dueDate, to: value }
		}));
	}

	function handleApplyFilters(event: MouseEvent<HTMLButtonElement> | KeyboardEvent) {
		filters(filter);
		toggleDrawer(false)(event);
	}

	function clearFilters(event: MouseEvent<HTMLButtonElement> | KeyboardEvent) {
		setFilter({
			type: [],
			status: [],
			createdAt: { from: null, to: null },
			dueDate: { from: null, to: null },
			supplier: ''
		});
		filters(filter);
		// toggleDrawer(false)(event);
	}

	const list = () => (
		<Box
			component="div"
			sx={{ width: 350 }}
			role="presentation"
			onClick={() => toggleDrawer(false)}
			onKeyDown={() => toggleDrawer(false)}
		>
			<List>
				<ListItem>
					<Typography
						variant="h4"
						component="h1"
						fontWeight="bold"
						color="primary"
					>
						FILTROS
					</Typography>
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem className="flex flex-col">
					<ListItemText>Tipo de solicitação</ListItemText>
					<Autocomplete
						options={['Pagamento geral', 'Compras', 'Reembolso']}
						fullWidth
						onChange={handleTypeRequestFilter}
						multiple
						value={filter.type}
						renderInput={params => (
							<TextField
								{...params}
								fullWidth
								label="Escolha um tipo de solicitação"
							/>
						)}
					/>
				</ListItem>
				<ListItem className="flex flex-col">
					<ListItemText>Status</ListItemText>
					<Autocomplete
						options={['Em andamento', 'Em análise', 'Concluído']}
						fullWidth
						multiple
						value={filter.status}
						onChange={handleStatusRequestFilter}
						renderInput={params => (
							<TextField
								{...params}
								fullWidth
								label="Escolha um status"
							/>
						)}
					/>
				</ListItem>

				<ListItem className="flex flex-col">
					<ListItemText>Data de cadastro</ListItemText>
					<div className="flex flex-row gap-10">
						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							adapterLocale={ptBR}
						>
							<DatePicker
								className="w-full"
								label="De"
								value={filter.createdAt.from}
								format="dd/MM/yyyy"
								onChange={(value: Date) => handleCreatedAtFromRequestFilter(value)}
								sx={{
									'& .MuiFormHelperText-root': {
										position: 'absolute',
										top: '55px'
									}
								}}
							/>
						</LocalizationProvider>
						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							adapterLocale={ptBR}
						>
							<DatePicker
								className="w-full"
								label="Até"
								value={filter.createdAt.to}
								onChange={(value: Date) => handleCreatedAtToRequestFilter(value)}
								format="dd/MM/yyyy"
								sx={{
									'& .MuiFormHelperText-root': {
										position: 'absolute',
										top: '55px'
									}
								}}
							/>
						</LocalizationProvider>
					</div>
				</ListItem>

				<ListItem className="flex flex-col">
					<ListItemText>Data de vencimento</ListItemText>
					<div className="flex flex-row gap-10">
						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							adapterLocale={ptBR}
						>
							<DatePicker
								className="w-full"
								label="De"
								format="dd/MM/yyyy"
								value={filter.dueDate.from}
								onChange={(value: Date) => handleDueDateFromRequestFilter(value)}
								sx={{
									'& .MuiFormHelperText-root': {
										position: 'absolute',
										top: '55px'
									}
								}}
							/>
						</LocalizationProvider>
						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							adapterLocale={ptBR}
						>
							<DatePicker
								className="w-full"
								onChange={(value: Date) => handleDueDateToRequestFilter(value)}
								label="Até"
								value={filter.dueDate.to}
								format="dd/MM/yyyy"
								sx={{
									'& .MuiFormHelperText-root': {
										position: 'absolute',
										top: '55px'
									}
								}}
							/>
						</LocalizationProvider>
					</div>
				</ListItem>

				<ListItem className="flex flex-col">
					<ListItemText>Fornecedor</ListItemText>
					<TextField
						fullWidth
						value={filter.supplier}
						label="Digite um CPF ou CNPJ"
						onChange={event => setFilter(prevState => ({ ...prevState, supplier: event.target.value }))}
					/>
				</ListItem>

				<ListItem />
				<ListItem />
				<ListItem />

				<Divider />

				<ListItem />
				<ListItem />
				<ListItem />

				<ListItem className="flex justify-center gap-10">
					<Button
						onClick={event => clearFilters(event)}
						variant="outlined"
					>
						LIMPAR FILTROS
					</Button>

					<Button
						onClick={event => handleApplyFilters(event)}
						variant="contained"
					>
						APLICAR
					</Button>
				</ListItem>
			</List>
		</Box>
	);

	return (
		<div>
			{(['right'] as const).map(anchor => (
				<Fragment key={anchor}>
					<Drawer
						anchor={anchor}
						open={open}
						// open
						onClose={toggleDrawer(false)}
					>
						{list()}
					</Drawer>
				</Fragment>
			))}
		</div>
	);
}

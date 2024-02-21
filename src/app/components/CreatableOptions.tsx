import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';

interface CreatableProps {
	newData: (data: ProductOptionType) => void;
	selectedData: (data: ProductOptionType) => void;
	products: ProductOptionType[];
	cleanInput: boolean;
}

export interface ProductOptionType {
	inputValue?: string;
	name?: string;
	category?: string;
}

const filter = createFilterOptions<ProductOptionType>();

export default function CreatableOptions({ newData, selectedData, products, cleanInput }: CreatableProps) {
	const [value, setValue] = React.useState<ProductOptionType | null>(null);
	const [open, toggleOpen] = React.useState(false);
	const [controlCharacter, setControlCharacter] = React.useState('');
	const [dialogValue, setDialogValue] = React.useState({
		name: '',
		category: ''
	});

	React.useEffect(() => {
		setValue(null);
	}, [cleanInput]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setControlCharacter(event.target.value);
	};

	const handleClose = () => {
		setDialogValue({
			name: '',
			category: ''
		});
		toggleOpen(false);
	};

	React.useEffect(() => {
		if (value) {
			selectedData({ name: value.name, category: value.category });
		}
	}, [value]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		newData(dialogValue);
		handleClose();
	};

	return (
		<>
			<Autocomplete
				value={value}
				onChange={(event, newValue) => {
					if (typeof newValue === 'string') {
						toggleOpen(true);
						setDialogValue({
							name: newValue,
							category: ''
						});

						selectedData(dialogValue);
					} else if (newValue && newValue.inputValue) {
						toggleOpen(true);
						setDialogValue({
							name: newValue.inputValue,
							category: ''
						});
						selectedData(dialogValue);
					} else {
						setValue(newValue as ProductOptionType);
					}
				}}
				filterOptions={(options, params) => {
					const filtered = filter(options, params);

					if (params.inputValue !== '') {
						filtered.push({
							inputValue: params.inputValue,
							name: `Add "${params.inputValue}"`
						});
					}

					return filtered;
				}}
				id="free-solo-dialog-demo"
				options={controlCharacter.length > 2 ? products : []}
				getOptionLabel={option => {
					if (typeof option === 'string') {
						return option;
					}
					if (option.inputValue) {
						return option.inputValue;
					}
					return option.name;
				}}
				selectOnFocus
				clearOnBlur
				handleHomeEndKeys
				renderOption={(props, option) => (
					<li {...props}>
						{option.name} {option.category ? `| ${option.category}` : ''}
					</li>
				)}
				fullWidth
				freeSolo
				renderInput={params => (
					<TextField
						{...params}
						label="Digite um produto"
						onChange={handleInputChange}
					/>
				)}
			/>
			<Dialog
				open={open}
				onClose={handleClose}
			>
				<form onSubmit={handleSubmit}>
					<DialogTitle>Adicione um novo produto</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Deseja selecionar um produto que não existe no nosso banco de dados? Adicione aqui!
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							value={dialogValue.name}
							onChange={event =>
								setDialogValue({
									...dialogValue,
									name: event.target.value
								})
							}
							label="Produto"
							type="text"
							variant="standard"
						/>
						<TextField
							margin="dense"
							id="name"
							value={dialogValue.category}
							onChange={event =>
								setDialogValue({
									...dialogValue,
									category: event.target.value
								})
							}
							label="Categoria"
							type="text"
							variant="standard"
						/>
					</DialogContent>
					<DialogActions>
						<Button
							variant="text"
							onClick={handleClose}
						>
							Cancelar
						</Button>
						<Button
							variant="text"
							type="submit"
						>
							Adicionar
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}

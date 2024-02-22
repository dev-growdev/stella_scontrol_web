import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

interface CreatableProps {
	newData: (data: ProductOptionType) => void;
	selectedData: (data: ProductOptionType) => void;
	products: ProductOptionType[];
	cleanInput: boolean;
}

export interface ProductOptionType {
	inputValue?: string;
	name?: string;
}

const filter = createFilterOptions<ProductOptionType>();

export default function CreatableOptions({ newData, selectedData, products, cleanInput }: CreatableProps) {
	const [value, setValue] = useState<ProductOptionType | null>(null);
	const [open, toggleOpen] = useState(false);
	const [controlCharacter, setControlCharacter] = useState('');
	const [dialogValue, setDialogValue] = useState('');

	useEffect(() => {
		setValue(null);
	}, [cleanInput]);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setControlCharacter(event.target.value);
	};

	const handleClose = () => {
		setDialogValue('');
		toggleOpen(false);
	};

	useEffect(() => {
		if (value) {
			selectedData({ name: value.name });
		}
	}, [value]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		newData({ name: dialogValue });
		handleClose();
	};

	return (
		<>
			<Autocomplete
				value={value}
				onChange={(event, newValue) => {
					if (typeof newValue === 'string') {
						toggleOpen(true);
						setDialogValue(newValue);
						selectedData({ name: newValue });
					} else if (newValue && newValue.inputValue) {
						toggleOpen(true);
						setDialogValue(newValue.inputValue);
						selectedData({ name: newValue.inputValue });
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
				renderOption={(props, option) => <li {...props}>{option.name}</li>}
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
							value={dialogValue}
							onChange={event => setDialogValue(event.target.value)}
							label="Produto"
							type="text"
							variant="standard"
							fullWidth
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

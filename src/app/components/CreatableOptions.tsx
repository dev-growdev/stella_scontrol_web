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
}

export interface ProductOptionType {
	inputValue?: string;
	product?: string;
	brand?: string;
}

const filter = createFilterOptions<ProductOptionType>();

export default function CreatableOptions({ newData, selectedData, products }: CreatableProps) {
	const [value, setValue] = React.useState<ProductOptionType | null>(null);
	const [open, toggleOpen] = React.useState(false);
	const [controlCharacter, setControlCharacter] = React.useState('');
	const [dialogValue, setDialogValue] = React.useState({
		product: '',
		brand: ''
	});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setControlCharacter(event.target.value);
	};

	const handleClose = () => {
		setDialogValue({
			product: '',
			brand: ''
		});
		toggleOpen(false);
	};

	React.useEffect(() => {
		if (value) {
			selectedData({ product: value.product, brand: value.brand });
		}
	}, [value]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		newData(dialogValue);
		handleClose();
	};

	return (
		<React.Fragment>
			<Autocomplete
				value={value}
				onChange={(event, newValue) => {
					if (typeof newValue === 'string') {
						toggleOpen(true);
						setDialogValue({
							product: newValue,
							brand: ''
						});

						selectedData(dialogValue);
					} else if (newValue && newValue.inputValue) {
						toggleOpen(true);
						setDialogValue({
							product: newValue.inputValue,
							brand: ''
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
							product: `Add "${params.inputValue}"`
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
					return option.product;
				}}
				selectOnFocus
				clearOnBlur
				handleHomeEndKeys
				renderOption={(props, option) => (
					<li {...props}>
						{option.product} {option.brand ? `| ${option.brand}` : ''}
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
							value={dialogValue.product}
							onChange={event =>
								setDialogValue({
									...dialogValue,
									product: event.target.value
								})
							}
							label="Produto"
							type="text"
							variant="standard"
						/>
						<TextField
							margin="dense"
							id="name"
							value={dialogValue.brand}
							onChange={event =>
								setDialogValue({
									...dialogValue,
									brand: event.target.value
								})
							}
							label="Marca"
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
		</React.Fragment>
	);
}

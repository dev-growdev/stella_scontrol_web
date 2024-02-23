// import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
// import { ChangeEvent, useEffect, useState } from 'react';

// interface CreatableProps {
// 	newData: (data: ProductOptionType) => void;
// 	selectedData: (data: ProductOptionType) => void;
// 	products: ProductOptionType[];

// }

// export interface ProductOptionType {
// 	inputValue?: string;
// 	name?: string;
// }

// const filter = createFilterOptions<ProductOptionType>();

// export default function CreatableOptions({ newData, selectedData, products, cleanInput }: CreatableProps) {
// 	const [value, setValue] = useState<ProductOptionType | null>(null);
// 	const [controlCharacter, setControlCharacter] = useState('');
// 	const [dialogValue, setDialogValue] = useState('');

// 	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
// 		setControlCharacter(event.target.value);
// 	};

// 	// const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
// 	// 	event.preventDefault();
// 	// 	newData({ name: dialogValue });
// 	// 	setDialogValue('');
// 	// };

// 	return (
// 		<Autocomplete
// 			value={value}
// 			onChange={(event, newValue) => {
// 				if (typeof newValue === 'string') {
// 					newData(newValue);
// 					selectedData({ name: newValue });
// 				} else if (newValue && newValue.inputValue) {
// 					newData(newValue.inputValue);
// 					selectedData({ name: newValue.inputValue });
// 				} else {
// 					setValue(newValue);
// 				}
// 			}}
// 			filterOptions={(options, params) => {
// 				const filtered = filter(options, params);

// 				if (params.inputValue !== '') {
// 					filtered.push({
// 						inputValue: params.inputValue,
// 						name: `Add "${params.inputValue}"`
// 					});
// 				}

// 				return filtered;
// 			}}
// 			id="free-solo-dialog-demo"
// 			options={controlCharacter.length > 2 ? products : []}
// 			getOptionLabel={option => {
// 				if (typeof option === 'string') {
// 					return option;
// 				}
// 				if (option.inputValue) {
// 					return option.inputValue;
// 				}
// 				return option.name;
// 			}}
// 			selectOnFocus
// 			clearOnBlur
// 			handleHomeEndKeys
// 			renderOption={(props, option) => <li {...props}>{option.name}</li>}
// 			fullWidth
// 			freeSolo
// 			renderInput={params => (
// 				<TextField
// 					{...params}
// 					label="Digite um produto"
// 					onChange={handleInputChange}
// 				/>
// 			)}
// 		/>
// 	);
// }

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

interface CreatableProps {
	selectedData: (data: ProductOptionType | string) => void;
	products: ProductOptionType[];
	cleanInput: boolean;
}

export interface ProductOptionType {
	inputValue?: string;
	name?: string;
}

export default function CreatableOptions({ selectedData, products, cleanInput }: CreatableProps) {
	const [value, setValue] = useState<ProductOptionType | null>(null);
	const [controlCharacter, setControlCharacter] = useState('');

	useEffect(() => {
		setValue(null);
	}, [cleanInput]);

	const handleInputChange = (event: string) => {
		setControlCharacter(event);
		selectedData(event);
	};

	return (
		<Autocomplete
			className="w-full"
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
				selectedData(newValue);
			}}
			options={controlCharacter.length > 2 ? products : []}
			getOptionLabel={option => option.name || ''}
			renderInput={params => (
				<TextField
					fullWidth
					onChange={e => handleInputChange(e.target.value)}
					{...params}
					label="Digite um produto"
				/>
			)}
		/>
	);
}

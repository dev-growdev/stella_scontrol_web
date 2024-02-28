import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ChangeEvent, useEffect, useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FormDataProps } from '../main/form-request/FormRequest';

interface CreatableOptions {
	selectedData: (data: ProductOptionType | string) => void;
	products: ProductOptionType[];
	cleanInput: boolean;
	errors: FieldErrors<FormDataProps>;
	control: Control<FormDataProps>;
}

export interface ProductOptionType {
	inputValue?: string;
	name?: string;
}

export default function CreatableOptions({ selectedData, products, cleanInput, errors, control }: CreatableOptions) {
	const [value, setValue] = useState<ProductOptionType | null>(null);
	const [controlCharacter, setControlCharacter] = useState('');

	useEffect(() => {
		setValue(null);
	}, [cleanInput]);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setControlCharacter(event.target.value);
		selectedData(event.target.value);
	};
	return (
		<Controller
			name="tableData"
			control={control}
			render={({ field }) => (
				<Autocomplete
					className="w-full"
					value={value}
					onChange={(event: ChangeEvent<HTMLInputElement>) => {
						setValue({ name: event.target.value });
						selectedData({ name: event.target.value });
					}}
					options={controlCharacter.length > 2 ? products : []}
					getOptionLabel={option => option.name || ''}
					renderInput={params => (
						<TextField
							{...field}
							fullWidth
							onChange={e => handleInputChange(e)}
							{...params}
							label="Digite um produto"
							error={!!errors.tableData}
							helperText={errors?.tableData?.message}
						/>
					)}
				/>
			)}
		/>
	);
}

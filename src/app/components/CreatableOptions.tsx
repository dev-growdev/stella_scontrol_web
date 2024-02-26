import { FormHelperText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FormDataProps } from '../main/form-request/FormRequest';

interface CreatableProps {
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

export default function CreatableOptions({ selectedData, products, cleanInput, errors, control }: CreatableProps) {
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
		<Controller
			name="tableData"
			control={control}
			render={({ field }) => (
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
						<>
							<TextField
								{...field}
								fullWidth
								onChange={e => handleInputChange(e.target.value)}
								{...params}
								label="Digite um produto"
								error={!!errors?.tableData}
							/>
							<FormHelperText error>{errors?.tableData?.message}</FormHelperText>
						</>
					)}
				/>
			)}
		/>
	);
}

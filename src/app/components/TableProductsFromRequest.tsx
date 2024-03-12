import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Autocomplete, Button, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ChangeEvent, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormDataProps, ProductOptionType } from '../main/form-request/FormRequest';

interface TableProductsFromRequestProps {
	control: Control<FormDataProps>;
	errors: FieldErrors<FormDataProps>;
	productsToOptions: ProductOptionType[];
	setValueProducts: UseFormSetValue<FormDataProps>;
	watch: UseFormWatch<FormDataProps>;
}

export default function TableProductsFromRequest({
	control,
	errors,
	productsToOptions,
	setValueProducts,
	watch
}: TableProductsFromRequestProps) {
	const [value, setValue] = useState<ProductOptionType | null>(null);
	const products = watch('products');

	const handleInputValueAutoComplete = (event: ChangeEvent<HTMLInputElement>) => {
		setValue({ product: event.target.outerText });
	};
	const handleInputValueTextField = (event: ChangeEvent<HTMLInputElement>) => {
		setValue({ product: event.target.value });
	};

	const handleAddProduct = () => {
		setValueProducts('products', [...products, { product: value.product }]);
		setValue(null);
	};

	return (
		<>
			<div className="flex flex-col sm:flex-row relative gap-24 items-center justify-center">
				<Controller
					name="products"
					control={control}
					render={({ field }) => (
						<Autocomplete
							{...field}
							className="w-full"
							value={value}
							noOptionsText="Adicione um novo produto."
							onChange={handleInputValueAutoComplete}
							options={productsToOptions}
							getOptionLabel={option => option.product || ''}
							renderInput={params => (
								<TextField
									{...field}
									fullWidth
									sx={{
										'& .MuiFormHelperText-root': {
											position: 'absolute',
											top: '55px'
										}
									}}
									onChange={handleInputValueTextField}
									{...params}
									label="Digite um produto"
									error={!!errors?.products?.message}
									helperText={errors?.products?.message}
								/>
							)}
						/>
					)}
				/>
				<Button
					className="w-full sm:w-256"
					onClick={handleAddProduct}
					sx={{ borderRadius: '7px' }}
					variant="contained"
					startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
				>
					ADICIONAR ITEM
				</Button>
			</div>
			<TableContainer
				className="my-10"
				component={Paper}
				elevation={3}
			>
				<Table
					sx={{ minWidth: 700 }}
					aria-label="customized table"
				>
					<TableHead>
						<TableRow>
							<TableCell sx={{ backgroundColor: '#ffffff' }}>PRODUTOS</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{products.map((item, index) => (
							<div key={item.product}>
								<Controller
									name={`products.${index}.product`}
									control={control}
									render={({ field }) => (
										<TableRow {...field}>
											<TableCell>{item.product}</TableCell>
										</TableRow>
									)}
								/>
							</div>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

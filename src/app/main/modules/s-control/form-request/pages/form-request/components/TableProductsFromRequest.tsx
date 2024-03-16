import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Autocomplete,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { FormDataType } from '../entities/formData';
import { ProductOptionType } from '../entities/productOptions';

interface TableProductsFromRequestProps {
	control: Control<FormDataType>;
	errors: FieldErrors<FormDataType>;
	productsToOptions: ProductOptionType[];
	setValueProducts: UseFormSetValue<FormDataType>;
	watch: UseFormWatch<FormDataType>;
}

export function TableProductsFromRequest({
	control,
	errors,
	productsToOptions,
	setValueProducts,
	watch
}: TableProductsFromRequestProps) {
	const [value, setValue] = useState<ProductOptionType | null>(null);
	const products = watch('products');
	const dispatch = useAppDispatch();

	const handleInputValueAutoComplete = (event: ChangeEvent<HTMLInputElement>) => {
		setValue({ product: event.target.outerText });
	};
	const handleInputValueTextField = (event: ChangeEvent<HTMLInputElement>) => {
		setValue({ product: event.target.value });
	};

	const handleAddProduct = () => {
		if (!value || !value.product) {
			dispatch(
				showMessage({
					message: 'Adicione um produto para enviar solicitação',
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);

			return;
		}
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

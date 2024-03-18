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
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { ChangeEvent, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductOptionType } from '../types/productOptions';
import { TPaymentRequestForm } from '../validations/paymentRequestForm.schema';

interface TableProductsFromRequestProps {
	control: Control<TPaymentRequestForm>;
	errors: FieldErrors<TPaymentRequestForm>;
	productsToOptions: ProductOptionType[];
	setValueProducts: UseFormSetValue<TPaymentRequestForm>;
	watch: UseFormWatch<TPaymentRequestForm>;
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

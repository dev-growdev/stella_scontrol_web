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
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { selectProducts } from '~/modules/s-control/pages/products/store/productsSlice';
import { useSelectorSControl } from '~/modules/s-control/store/hooks';
import { ProductOptionType } from '../types/productOptions';
import { TPaymentRequestForm } from '../validations/paymentRequestForm.schema';

interface TableProductsFromRequestProps {
	readMode: boolean;
	errors: FieldErrors<TPaymentRequestForm>;
	setValueProducts: UseFormSetValue<TPaymentRequestForm>;
	watch: UseFormWatch<TPaymentRequestForm>;
	handleProductsRemove: (arg: number) => void;
}

export function TableProductsFromRequest({
	errors,
	setValueProducts,
	watch,
	readMode,
	handleProductsRemove
}: TableProductsFromRequestProps) {
	const [value, setValue] = useState<ProductOptionType | null>(null);
	const productsForm = watch('products');
	const products = useSelectorSControl(selectProducts);
	const [productsToOptionsSelect, setProductsToOptionsSelect] = useState<ProductOptionType[]>([]);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (products.products.length > 0) {
			setProductsToOptionsSelect(products.products.filter(product => product.enable));
		}
	}, [products]);

	const handleInputValueAutoComplete = (_event: ChangeEvent, newValue: ProductOptionType | null) => {
		setValue(newValue);
	};

	const handleInputValueTextField = (event: ChangeEvent<HTMLInputElement>) => {
		setValue({ name: event.target.value });
	};

	const handleAddProduct = () => {
		if (!value || !value.name) {
			dispatch(
				showMessage({
					message: 'Digite um produto para adicionar.',
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);
			return;
		}

		setValueProducts('products', [...productsForm, value]);
		setValue(null);
	};

	return (
		<>
			{!readMode && (
				<div className="flex flex-col sm:flex-row relative gap-24 items-center justify-center">
					<Autocomplete
						className="w-full"
						value={value}
						onChange={handleInputValueAutoComplete}
						options={productsToOptionsSelect}
						getOptionLabel={option => option.name}
						renderInput={params => (
							<TextField
								{...params}
								fullWidth
								onChange={handleInputValueTextField}
								label="Digite um produto"
								error={!!errors?.products?.message}
								helperText={errors?.products?.message}
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
			)}
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
						{productsForm.map((item: { name?: string; uid?: string } | string, index) => (
							<TableRow
								key={typeof item === 'object' ? item.uid ?? `${Math.floor(Math.random() * 10)}` : item}
							>
								<TableCell>
									<div className="flex flex-row">
										{typeof item === 'object' ? item.name : item}{' '}
										<FuseSvgIcon
											onClick={() => handleProductsRemove(index)}
											className="ml-20  text-gray-300"
										>
											heroicons-outline:trash
										</FuseSvgIcon>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

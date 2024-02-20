import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Product, disableProduct, getProducts, selectProducts } from './productsSlice';
import ProductTable from '../../components/ProductTable';

export default function ProductsPage() {
	const dispatch = useAppDispatch();
	const productsRedux = useSelector(selectProducts);
  
	useEffect(() => {
	  dispatch(getProducts());
	}, [dispatch]);
  
	useEffect(() => {
	  console.log(productsRedux);
	}, [productsRedux]);

	function handleGetStatus(item: Product) {
		const itemToggleEnable = {
			uid: item.uid,
			categoryId: item.categoryId,
			code: item.code,
			name: item.name,
			enable: !item.enable,
			measurement: item.measurement,
			quantity: item.quantity,

			action: ''
		};

		dispatch(disableProduct(itemToggleEnable));
	}

	return (
		<Box>
			<div className="p-32 mt-20">
				<Paper
					elevation={4}
					className="p-28"
				>
					<Typography
						className="text-20 md:text-28"
						component="h1"
						variant="h4"
						fontWeight={400}
					>
						Produtos
					</Typography>
				</Paper>

				<Paper
					elevation={4}
					className="mt-24 p-36 flex flex-col gap-24"
				>
					<div className="flex flex-col sm:flex-row items-center gap-24">
						<TextField
							name="name"
							fullWidth
							label="Digite para editar esse produto"
						/>

						<Button
							className="w-full sm:w-144 pl-60 pr-64"
							variant="contained"
						>
							EDITAR
						</Button>
					</div>
					<div className="flex items-center gap-24 flex-col sm:flex-row">
						{/* <ProductTable
							productsData={productsRedux}
							handleStatus={handleGetStatus}
						/> */}
					</div>
				</Paper>
			</div>
		</Box>
	);
}

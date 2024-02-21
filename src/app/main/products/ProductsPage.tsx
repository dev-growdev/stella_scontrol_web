import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { useEffect } from 'react';
import { getProducts, selectProducts } from './productsSlice';
import ProductTable from '../../components/ProductTable';
import { useSelector } from 'react-redux';

export default function ProductsPage() {
	const dispatch = useAppDispatch();
	const productsRedux = useSelector(selectProducts);

	useEffect(() => {
	  dispatch(getProducts());
	}, []);
  
	useEffect(() => {
	  console.log(productsRedux);
	}, [productsRedux]);

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
					<div className="flex items-center gap-24 flex-col sm:flex-row">
						<ProductTable
							productsData={productsRedux}
						/>
					</div>
				</Paper>
			</div>
		</Box>
	);
}

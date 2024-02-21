import { Box, Paper, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { useEffect } from 'react';
import ProductTable from '../../components/ProductTable';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Product, disableProduct, getProducts, selectProducts } from './productsSlice';

export default function ProductsPage() {
	const dispatch = useAppDispatch();
	const productsRedux = useSelector(selectProducts);
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getProducts());
	}, []);

	function handleEditProduct(product: Product) {
		return navigate(`/cadastrar-produto/${product.uid}`);
	}

	async function handleGetStatus(item: Product) {
		const itemToggleEnable = {
			uid: item.uid,
			category: item.category.uid,
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
					<div className="flex items-center gap-24 flex-col sm:flex-row">
						<ProductTable
							productsData={productsRedux}
							handleStatus={handleGetStatus}
							selectItem={handleEditProduct}
						/>
					</div>
				</Paper>
			</div>
		</Box>
	);
}

import { Box, Paper } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import ProductTable from '../../components/ProductTable';
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
					className="mt-24 flex flex-col gap-24 py-16"
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

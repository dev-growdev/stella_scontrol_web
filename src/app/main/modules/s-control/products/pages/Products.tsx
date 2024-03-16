import { Box, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import ProductTable from '../../components/ProductTable';
import { disableProduct, getProducts, selectProducts } from '../store/productsSlice';
import { useDispatchSControl, useSelectorSControl } from '../../store/hooks';
import { ProductType } from '../entities/product';

export default function Products() {
	const dispatch = useDispatchSControl();
	const productsRedux = useSelectorSControl(selectProducts);
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getProducts());
	}, []);

	function handleEditProduct(product: ProductType) {
		return navigate(`/cadastrar-produto/${product.uid}`);
	}

	async function handleGetStatus(item: ProductType) {
		const itemToggleEnable = {
			uid: item.uid,
			category: item.category.uid,
			name: item.name,
			enable: !item.enable,
			description: item.description,
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

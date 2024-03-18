import { Box, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { disableProduct, getProducts, selectProducts } from '../store/productsSlice';
import { useDispatchSControl, useSelectorSControl } from '~/modules/s-control/store/hooks';
import { ProductType } from '../types/product';
import { ProductTable } from '~/modules/s-control/components/product-table/ProductTable';

export default function Products() {
	const dispatchSControl = useDispatchSControl();
	const productsRedux = useSelectorSControl(selectProducts);
	const navigate = useNavigate();

	useEffect(() => {
		dispatchSControl(getProducts());
	}, []);

	function handleEditProduct(product: ProductType) {
		return navigate(`cadastro/${product.uid}`);
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
		dispatchSControl(disableProduct(itemToggleEnable));
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

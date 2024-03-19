import { Box, Paper } from '@mui/material';
import { SupplierTable } from '../../components/supplier-table/SupplierTable';

export default function Suppliers() {
	/* const dispatchSControl = useDispatchSControl();
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
	} */

	return (
		<Box>
			<div className="p-32 mt-20">
				<Paper
					elevation={4}
					className="mt-24 flex flex-col gap-24 py-16"
				>
					<div className="flex items-center gap-24 flex-col sm:flex-row">
						<SupplierTable suppliersData={console.log('cheguei aqui')} />
					</div>
				</Paper>
			</div>
		</Box>
	);
}

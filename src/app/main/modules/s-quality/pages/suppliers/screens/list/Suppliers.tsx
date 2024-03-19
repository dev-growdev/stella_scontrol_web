import { useEffect, useState } from 'react';
import { SupplierTable } from './components/supplier-table/SupplierTable';
import { Header } from './components/Header';
import { DefaultPage } from '~/modules/s-quality/components/DefaultPage';

export default function Suppliers() {
	const [searchValue, setSearchValue] = useState('');
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

	useEffect(() => {
		console.log('searchValue', searchValue);
	}, [searchValue]);

	return (
		<DefaultPage>
			<Header
				searchValue={searchValue}
				setSearchValue={setSearchValue}
			/>
			<SupplierTable suppliersData={[]} />
		</DefaultPage>
	);
}

import { useEffect, useState } from 'react';
import { SupplierTable } from './components/supplier-table/SupplierTable';
import { Header } from './components/Header';
import { DefaultPage } from '~/modules/s-quality/components/DefaultPage';

export default function Suppliers() {
	const [searchValue, setSearchValue] = useState('');

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

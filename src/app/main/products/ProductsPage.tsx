import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Product, disableProduct, getProducts, selectProducts, updateProduct } from './productSlice';
import ProductTable from 'app/components/ProductTable';

export default function ProductsPage() {
	const [editMode, setEditMode] = useState(false);
	const [editProduct, setEditProduct] = useState<Product | null>(null);
	const [newItem, setNewItem] = useState('');
	const dispatch = useAppDispatch();
	const productsRedux = useSelector(selectProducts);

	useEffect(() => {
		dispatch(getProducts());
	}, []);

	function handleGetEditProduct(selectedData: Product) {
		setEditProduct(selectedData);
		setEditMode(true);
	}

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

	function handleEditPropertiesProduct(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value, type } = e.target;

		if (type === 'text' || type === 'input') {
			if (name === 'name') {
				setEditProduct(prevItem => ({
					...prevItem,
					name: value
				}));
			}
		}

		if (type === 'checkbox') {
			const target = e.target as HTMLInputElement;
			if (name === 'enable') {
				setEditProduct(prevItem => ({
					...prevItem,
					enable: target.checked
				}));
			}
		}
	}

	function submitEditProduct() {
		dispatch(updateProduct(editProduct)).then(res => {
			if (res.payload && Array.isArray(res.payload.categories)) {
				dispatch(
					showMessage({
						message: `Esse nome de categoria já existe.`,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'error'
					})
				);
			} else {
				dispatch(
					showMessage({
						message: `Categoria atualizada com sucesso.`,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					})
				);
				setEditMode(false);
			}
		});
	}

	function handleCancelEditProduct() {
		setEditMode(false);
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
							value={editMode ? editProduct.name : newItem}
							onChange={editMode ? e => handleEditPropertiesProduct(e) : e => setNewItem(e.target.value)}
							label="Digite para editar esse produto"
						/>

						<Button
							onClick={submitEditProduct}
							disabled={editMode}
							className="w-full sm:w-144 pl-60 pr-64"
							variant="contained"
						>
							EDITAR
						</Button>
					</div>
					{/* {editMode && (
						<div className="flex">
							<Button
								className="w-full sm:w-144 pl-60 pr-64"
								variant="contained"
								onClick={submitEditProduct}
							>
								EDITAR
							</Button>
							<Button
								className="w-full sm:w-144 pl-60 pr-64 ml-10"
								variant="outlined"
								onClick={handleCancelEditProduct}
							>
								CANCELAR
							</Button>
						</div>
					)} */}
					<div className="flex items-center gap-24 flex-col sm:flex-row">
						{/* <ProductTable
							productsData={productsRedux}
							selectItem={handleGetEditProduct}
							handleStatus={handleGetStatus}
						/> */}
					</div>
				</Paper>
			</div>
		</Box>
	);
}

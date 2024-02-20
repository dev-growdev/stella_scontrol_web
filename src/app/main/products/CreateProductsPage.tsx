import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Autocomplete, Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../../styles/muiCustomComponents.css';
import { getCategories, selectCategories } from '../categories/categoriesSlice';
import { createProduct } from './productsSlice';

export default function CreateProductsPage() {
	const dispatch = useAppDispatch();
	const categories = useSelector(selectCategories);
	const [formDataProduct, setFormDataProduct] = useState({
		code: '',
		name: '',
		category: '',
		quantity: '',
		measurement: ''
	});

	useEffect(() => {
		console.log(formDataProduct);
	}, [formDataProduct]);

	useEffect(() => {
		dispatch(getCategories());
	}, []);

	const clearStates = () => {
		setFormDataProduct({
			code: '',
			name: '',
			category: '',
			quantity: '',
			measurement: ''
		});
	};

	const handleSubmit = async () => {
		const categoryId = categories.categories.find(category => category.name === formDataProduct.category);
		const productData = {
			categoryId: categoryId.uid ?? '',
			code: formDataProduct.code,
			name: formDataProduct.name,
			enable: true,
			measurement: formDataProduct.measurement,
			quantity: +formDataProduct.quantity
		};

		dispatch(createProduct(productData))
			.then(res => {
				if (res.payload.data && res.payload.data.code == 201) {
					dispatch(
						showMessage({
							message: 'Produto cadastrado com sucesso',
							anchorOrigin: {
								vertical: 'top',
								horizontal: 'center'
							},
							variant: 'success'
						})
					);
				}

				if (res.payload.response && res.payload.response.status == 400) {
					dispatch(
						showMessage({
							message: res.payload.response.data.message,
							anchorOrigin: {
								vertical: 'top',
								horizontal: 'center'
							},
							variant: 'error'
						})
					);
				}

				clearStates();
			})
			.catch(error => {
				console.error('Error:', error);
			});
	};

	const handlePropertiesChange = (field, value) => {
		setFormDataProduct({
			...formDataProduct,
			[field]: value
		});
	};

	return (
		<Box className="flex flex-col w-full">
			<div className="p-32 mt-20">
				<Button
					className="mb-12"
					variant="text"
					startIcon={<FuseSvgIcon>material-twotone:arrow_back_ios</FuseSvgIcon>}
				>
					VOLTAR
				</Button>

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
						Cadastrar Produto
					</Typography>
				</Paper>

				<Paper
					elevation={4}
					className="mt-24 p-36 flex flex-col gap-24"
				>
					<div className="flex flex-col gap-24 sm:flex-row">
						<Grid
							container
							spacing={3}
						>
							<Grid
								item
								xs={12}
								sm={4}
							>
								<TextField
									fullWidth
									required
									value={formDataProduct.code}
									onChange={e => handlePropertiesChange('code', e.target.value)}
									label="Código"
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={8}
							>
								<TextField
									fullWidth
									required
									value={formDataProduct.name}
									onChange={e => handlePropertiesChange('name', e.target.value)}
									label="Nome"
								/>
							</Grid>
						</Grid>
					</div>

					<div className="flex flex-col w-full gap-24">
						<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">
							<Autocomplete
								id="combo-box-demo"
								className="w-full"
								options={categories.categories.map(category => category.name)}
								onChange={(e, value) => handlePropertiesChange('category', value)}
								value={formDataProduct.category}
								renderInput={params => (
									<TextField
										{...params}
										label="Categoria"
									/>
								)}
							/>

							<TextField
								fullWidth
								value={formDataProduct.measurement}
								onChange={e => handlePropertiesChange('measurement', e.target.value)}
								label="Unidade de medida"
							/>
							<TextField
								fullWidth
								value={formDataProduct.quantity}
								onChange={e => handlePropertiesChange('quantity', e.target.value)}
								label="Quantidade por embalagem"
							/>
						</div>
					</div>

					<div className="flex justify-end gap-10 flex-col sm:flex-row">
						<Button
							variant="outlined"
							sx={{ borderRadius: '7px' }}
							onClick={clearStates}
						>
							CANCELAR
						</Button>
						<Button
							sx={{ borderRadius: '7px' }}
							variant="contained"
							onClick={handleSubmit}
							disabled={!formDataProduct.category || !formDataProduct.name || !formDataProduct.code}
						>
							ENVIAR
						</Button>
					</div>
				</Paper>
			</div>
		</Box>
	);
}

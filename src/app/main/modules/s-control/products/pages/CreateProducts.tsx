import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Autocomplete, Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { getCategories, selectCategories } from '../../categories/store/categoriesSlice';
import { FormProductType, createProduct, selectProducts, updateProduct } from '../store/productsSlice';
import { useDispatchSControl, useSelectorSControl } from '../../store/hooks';

export default function CreateProducts() {
	const dispatch = useAppDispatch();
	const dispatchSControl = useDispatchSControl();
	const categories = useSelectorSControl(selectCategories);
	const products = useSelectorSControl(selectProducts);
	const [editMode, setEditMode] = useState(false);
	const [formDataProduct, setFormDataProduct] = useState<FormProductType>({
		code: 0,
		name: '',
		category: '',
		description: '',
		quantity: '',
		measurement: ''
	});

	const navigate = useNavigate();

	const { productUid } = useParams();

	useEffect(() => {
		if (productUid) {
			setEditMode(true);
			const findProduct = products.products.find(product => product.uid === productUid);
			if (findProduct) {
				setFormDataProduct({
					uid: findProduct.uid,
					code: findProduct.code,
					name: findProduct.name,
					enable: findProduct.enable,
					category: findProduct.category.name,
					description: findProduct.description,
					quantity: `${findProduct.quantity}`,
					measurement: findProduct.measurement
				});
			}
		}
	}, [productUid]);

	useEffect(() => {
		dispatchSControl(getCategories());
	}, []);

	const clearStates = () => {
		setFormDataProduct({
			uid: '',
			code: 0,
			name: '',
			category: '',
			description: '',
			quantity: '',
			measurement: ''
		});
		if (editMode) {
			navigate(-1);
		}
	};

	const handleSubmitCreate = async () => {
		const categoryId = categories.categories.find(category => category.name === formDataProduct.category);
		const productData = {
			categoryId: categoryId.uid ?? '',
			name: formDataProduct.name,
			enable: true,
			description: formDataProduct.description,
			measurement: formDataProduct.measurement,
			quantity: +formDataProduct.quantity
		};

		dispatchSControl(createProduct(productData));
		clearStates();
	};

	function handleSubmitEdit() {
		const categoryId = categories.categories.find(category => category.name === formDataProduct.category);
		if (formDataProduct.uid === '' || !formDataProduct.uid) {
			dispatch(
				showMessage({
					message: 'Selecione um produto válido para ser editado.',
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'warning'
				})
			);
			clearStates();
		}
		const updateProductForm = {
			uid: formDataProduct.uid,
			category: categoryId.uid ?? '',
			name: formDataProduct.name,
			enable: formDataProduct.enable,
			description: formDataProduct.description,
			measurement: formDataProduct.measurement,
			quantity: +formDataProduct.quantity
		};

		dispatchSControl(updateProduct(updateProductForm));
		clearStates();
	}

	const handlePropertiesChange = (field, value: string) => {
		setFormDataProduct({
			...formDataProduct,
			[field]: value
		});
	};

	function handleRedirectToProducts() {
		navigate('/produtos');
	}

	return (
		<Box className="flex flex-col w-full">
			<div className="p-32 mt-20">
				<Button
					className="mb-12"
					variant="text"
					startIcon={<FuseSvgIcon>material-twotone:arrow_back_ios</FuseSvgIcon>}
					onClick={handleRedirectToProducts}
				>
					PRODUTOS
				</Button>

				<Paper
					elevation={4}
					className="p-28"
				>
					<Typography
						className="text-20 md:text-28"
						component="h1"
						variant="h4"
						fontWeight={500}
						color={theme => theme.palette.secondary.main}
					>
						{editMode ? 'Editar produto' : 'Cadastrar Produto'}
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
							{editMode ? (
								<Grid
									item
									xs={12}
									sm={4}
								>
									<TextField
										fullWidth
										value={formDataProduct.code}
										onChange={e => handlePropertiesChange('code', e.target.value)}
										label="Código"
										disabled
									/>
								</Grid>
							) : null}

							<Grid
								item
								xs={12}
								sm={editMode ? 4 : 6}
							>
								<TextField
									fullWidth
									required
									value={formDataProduct.name}
									onChange={e => handlePropertiesChange('name', e.target.value)}
									label="Nome"
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={editMode ? 4 : 6}
							>
								<Autocomplete
									id="combo-box-demo"
									className="w-full"
									options={categories.categories
										.filter(category => category.enable)
										.map(category => category.name)}
									onChange={(e, value) => handlePropertiesChange('category', value as string)}
									value={formDataProduct.category}
									renderInput={params => (
										<TextField
											{...params}
											label="Categoria"
										/>
									)}
								/>
							</Grid>
						</Grid>
					</div>

					<div className="flex flex-col w-full gap-24">
						<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">
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

					<div className="flex flex-col w-full gap-24">
						<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">
							<TextField
								rows={4}
								value={formDataProduct.description}
								onChange={e => handlePropertiesChange('description', e.target.value)}
								label="Descrição"
								multiline
								className="w-full"
							/>
						</div>
					</div>

					<div className="flex justify-end gap-10 flex-col sm:flex-row">
						<Button
							variant="outlined"
							onClick={clearStates}
						>
							CANCELAR
						</Button>
						<Button
							variant="contained"
							onClick={editMode ? handleSubmitEdit : handleSubmitCreate}
							disabled={!formDataProduct.category || !formDataProduct.name}
						>
							ENVIAR
						</Button>
					</div>
				</Paper>
			</div>
		</Box>
	);
}

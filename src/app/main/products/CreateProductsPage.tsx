import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Box,
	Button,
	Grid,
	Paper,
	TextField,
	Typography,
	MenuItem,
	Select,
	OutlinedInput,
	InputLabel,
	FormControl
} from '@mui/material';
import '../../../styles/muiCustomComponents.css';
import { useEffect, useState } from 'react';
import { useAppDispatch } from 'app/store';
import { createProduct } from './productSlice';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';

export default function CreateProductsPage() {
	const [code, setCode] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [category, setCategory] = useState<string>('');
	const [measurement, setMeasurement] = useState<string>('');
	const [quantity, setQuantity] = useState<string>('');
	const [categories, setCategories] = useState<string[]>([]);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categoriesData = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);

				const filteredCategories = categoriesData.data.data.filter(category => category.enable === true);

				setCategories(filteredCategories);
			} catch (error) {
				console.error(error);
			}
		};

		fetchCategories();
	}, [dispatch]);

	const clearStates = () => {
		setCode('');
		setName('');
		setCategory('');
		setMeasurement('');
		setQuantity('');
	};

	const handleSubmit = async () => {
		const productData = {
			categoryId: category,
			code,
			name,
			enable: true,
			measurement,
			quantity: parseInt(quantity)
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
			})
			.catch(error => {
				console.error('Error:', error);
			});
	};

	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: 200,
				width: 250
			}
		}
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
									value={code}
									onChange={e => setCode(e.target.value)}
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
									value={name}
									onChange={e => setName(e.target.value)}
									label="Nome"
								/>
							</Grid>
						</Grid>
					</div>

					<div className="flex flex-col w-full gap-24">
						<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">
							<FormControl className="w-full">
								<InputLabel id="demo-multiple-name-label">Categoria</InputLabel>
								<Select
									labelId="demo-multiple-name-label"
									id="demo-multiple-name"
									fullWidth
									required
									input={<OutlinedInput label="Categoria" />}
									value={category}
									onChange={e => setCategory(e.target.value)}
									MenuProps={MenuProps}
								>
									{Array.isArray(categories) &&
										categories.map(category => (
											<MenuItem
												key={category.uid}
												value={category.uid}
											>
												{category.name}
											</MenuItem>
										))}
								</Select>
							</FormControl>

							<TextField
								fullWidth
								value={measurement}
								onChange={e => setMeasurement(e.target.value)}
								label="Unidade de medida"
							/>
							<TextField
								fullWidth
								value={quantity}
								onChange={e => setQuantity(e.target.value)}
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
							disabled={!category || !name || !code}
						>
							ENVIAR
						</Button>
					</div>
				</Paper>
			</div>
		</Box>
	);
}

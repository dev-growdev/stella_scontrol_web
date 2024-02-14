import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, FormControlLabel, FormGroup, Paper, Switch, TextField, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../../components/DataTable';
import { Category, createCategory, getCategories, selectCategories, updateCategory } from './categoriesSlice';

export default function CategoriesPage() {
	const [editMode, setEditMode] = useState(false);
	const [editItem, setEditItem] = useState<Category | null>(null);
	const [newItem, setNewItem] = useState('');
	const dispatch = useAppDispatch();
	const categoriesRedux = useSelector(selectCategories);

	useEffect(() => {
		dispatch(getCategories());
	}, []);

	function handleGetEditItem(selectedData: any) {
		setEditItem(selectedData);
		setEditMode(true);
	}

	function handleEditPropertiesItem(e) {
		const { name, value, checked } = e.target;
		if (name === 'name') {
			setEditItem(prevItem => ({
				...prevItem,
				name: value
			}));
		}

		if (name === 'enable') {
			setEditItem(prevItem => ({
				...prevItem,
				enable: checked
			}));
		}
	}

	function submitEdit() {
		console.log('VAI EDITAR', editItem);
		dispatch(updateCategory(editItem));
		setEditMode(false);
	}

	function submitNewCategory() {
		const item = {
			name: newItem,
			enable: true
		};
		dispatch(createCategory(item));
		setNewItem('');
	}

	function handleCancelEdit() {
		setEditMode(false);
	}

	return (
		<>
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
							Cadastro de categorias
						</Typography>
					</Paper>

					<Paper
						elevation={4}
						className="mt-24 p-36 flex flex-col gap-24"
					>
						<Typography color="GrayText">Adicione novas categorias.</Typography>

						<div className="flex items-center gap-24">
							<TextField
								name="name"
								fullWidth
								value={editMode ? editItem.name : newItem}
								onChange={editMode ? e => handleEditPropertiesItem(e) : e => setNewItem(e.target.value)}
								label={
									editMode
										? 'Digite para editar essa categoria'
										: 'Digite para adicionar uma nova categoria'
								}
							/>

							{editMode ? (
								<FormGroup>
									<FormControlLabel
										control={
											<Switch
												name="enable"
												checked={editItem.enable ? true : false}
												onChange={e => handleEditPropertiesItem(e)}
											/>
										}
										label={editItem.enable ? 'Desativar' : 'Ativar'}
									/>
								</FormGroup>
							) : (
								<Button
									onClick={submitNewCategory}
									className="w-full sm:w-144 pl-60 pr-64"
									sx={{ borderRadius: '7px' }}
									variant="contained"
									startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
								>
									ADICIONAR
								</Button>
							)}
						</div>
						{editMode && (
							<div>
								<Button
									className="w-full sm:w-144 pl-60 pr-64"
									sx={{ borderRadius: '7px' }}
									variant="contained"
									onClick={submitEdit}
								>
									EDITAR
								</Button>
								<Button
									className="w-full sm:w-144 pl-60 pr-64"
									sx={{ borderRadius: '7px' }}
									variant="outlined"
									onClick={handleCancelEdit}
								>
									CANCELAR
								</Button>
							</div>
						)}
						<div className="flex items-center gap-24 flex-col sm:flex-row">
							<DataTable
								categoriesData={categoriesRedux.categories}
								selectItem={handleGetEditItem}
							/>
						</div>
					</Paper>
				</div>
			</Box>
		</>
	);
}

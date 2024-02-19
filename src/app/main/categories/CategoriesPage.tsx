import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../../components/DataTable';
import {
	Category,
	createCategory,
	disableCategory,
	getCategories,
	selectCategories,
	updateCategory
} from './categoriesSlice';

export default function CategoriesPage() {
	const [editMode, setEditMode] = useState(false);
	const [editCategory, setEditCategory] = useState<Category | null>(null);
	const [newItem, setNewItem] = useState('');
	const dispatch = useAppDispatch();
	const categoriesRedux = useSelector(selectCategories);

	useEffect(() => {
		dispatch(getCategories());
	}, []);

	function handleGetEditCategory(selectedData: Category) {
		setEditCategory(selectedData);
		setEditMode(true);
	}

	function handleGetStatus(item: Category) {
		const itemToggleEnable = {
			uid: item.uid,
			name: item.name,
			enable: !item.enable,
			action: ''
		};

		dispatch(disableCategory(itemToggleEnable));
	}

	function handleEditPropertiesCategory(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value, type } = e.target;

		if (type === 'text' || type === 'input') {
			if (name === 'name') {
				setEditCategory(prevItem => ({
					...prevItem,
					name: value
				}));
			}
		}

		if (type === 'checkbox') {
			const target = e.target as HTMLInputElement;
			if (name === 'enable') {
				setEditCategory(prevItem => ({
					...prevItem,
					enable: target.checked
				}));
			}
		}
	}

	function submitEditCategory() {
		dispatch(updateCategory(editCategory)).then(res => {
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

	function submitNewCategory() {
		const item = {
			name: newItem,
			enable: true
		};
		if (newItem === '') {
			return dispatch(
				showMessage({
					message: `Digite um nome para ser adicionado.`,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'warning'
				})
			);
		}
		dispatch(createCategory(item)).then(res => {
			if (res.payload === undefined) {
				dispatch(
					showMessage({
						message: `Categoria já existente.`,
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
						message: `Categoria cadastrada com sucesso.`,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					})
				);
			}
		});
		setNewItem('');
	}

	function handleCancelEditCategory() {
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
						Cadastro de categorias
					</Typography>
				</Paper>

				<Paper
					elevation={4}
					className="mt-24 p-36 flex flex-col gap-24"
				>
					<Typography color="GrayText">Adicione novas categorias.</Typography>

					<div className="flex flex-col sm:flex-row items-center gap-24">
						<TextField
							name="name"
							fullWidth
							value={editMode ? editCategory.name : newItem}
							onChange={editMode ? e => handleEditPropertiesCategory(e) : e => setNewItem(e.target.value)}
							label={
								editMode
									? 'Digite para editar essa categoria'
									: 'Digite para adicionar uma nova categoria'
							}
						/>

						<Button
							onClick={submitNewCategory}
							disabled={editMode}
							className="w-full sm:w-144 pl-60 pr-64"
							variant="contained"
							startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
						>
							ADICIONAR
						</Button>
					</div>
					{editMode && (
						<div className="flex">
							<Button
								className="w-full sm:w-144 pl-60 pr-64"
								variant="contained"
								onClick={submitEditCategory}
							>
								EDITAR
							</Button>
							<Button
								className="w-full sm:w-144 pl-60 pr-64 ml-10"
								variant="outlined"
								onClick={handleCancelEditCategory}
							>
								CANCELAR
							</Button>
						</div>
					)}
					<div className="flex items-center gap-24 flex-col sm:flex-row">
						<DataTable
							categoriesData={categoriesRedux}
							selectItem={handleGetEditCategory}
							handleStatus={handleGetStatus}
						/>
					</div>
				</Paper>
			</div>
		</Box>
	);
}

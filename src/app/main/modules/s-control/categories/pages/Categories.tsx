import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch } from 'app/store';
import { DataTable } from '../../components/data-table/DataTable';
import {
	createCategory,
	disableCategory,
	getCategories,
	selectCategories,
	updateCategory
} from '../store/categoriesSlice';
import { useSelectorSControl } from '../../store/hooks';
import { CategoryType } from '../entities/category';

export default function Categories() {
	const [editMode, setEditMode] = useState(false);
	const [editCategory, setEditCategory] = useState<CategoryType | null>(null);
	const [newItem, setNewItem] = useState('');
	const dispatch = useAppDispatch();
	const categoriesRedux = useSelectorSControl(selectCategories);

	useEffect(() => {
		dispatch(getCategories());
	}, []);

	function handleGetEditCategory(selectedData: CategoryType) {
		if (selectedData) {
			setEditCategory(selectedData);
			setEditMode(true);
		} else {
			setEditMode(false);
		}
	}

	async function handleGetStatus(item: CategoryType) {
		const itemToggleEnable = {
			uid: item.uid,
			name: item.name,
			enable: !item.enable,
			action: ''
		};
		await dispatch(disableCategory(itemToggleEnable));
		clearStates();
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
	}

	async function submitEditCategory() {
		await dispatch(updateCategory(editCategory));
		clearStates();
	}

	async function submitNewCategory() {
		const item = {
			name: newItem,
			enable: true
		};

		await dispatch(createCategory(item));

		clearStates();
	}

	function handleCancelEditCategory() {
		clearStates();
	}

	function clearStates() {
		setNewItem('');
		setEditCategory(null);
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
						fontWeight={500}
						sx={{ color: theme => theme.palette.secondary.main }}
					>
						Cadastro de categorias
					</Typography>
				</Paper>

				<Paper
					elevation={4}
					className="mt-24 flex flex-col gap-24"
				>
					<div className="flex px-24 mt-32 flex-col sm:flex-row items-center gap-24">
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
						<div className="flex px-24">
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

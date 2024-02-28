import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { selectUser } from 'app/store/user/userSlice';
import { ChangeEvent, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { array, boolean, date, object, string } from 'yup';
import '../../../styles/muiCustomComponents.css';
import AccountType from '../../components/AccountType';
import CreatableOptions, { ProductOptionType } from '../../components/CreatableOptions';
import CustomizedTables from '../../components/CustomizedTables';
import IsRatiable from '../../components/IsRatiable';
import PaymentMethod from '../../components/PaymentMethod';
import RequestUser from '../../components/RequestUser';
import RequiredReceipt from '../../components/RequiredReceipt';
import UploadFiles from '../../components/UploadFiles';
import ValueAndDueDate from '../../components/ValueAndDueDate';
import { getProducts, selectProducts } from '../products/productsSlice';

export interface FormDataProps {
	paymentMethod: string;
	requiredReceipt: boolean;
	isRatiable: boolean;
	tableData: { produtos: string }[];
	description: string;
	supplier: string;
	payments: { value: string; dueDate: Date | null }[];
	typeAccount: string;
	uploadedFiles: File[];
}

const defaultValues = {
	paymentMethod: '',
	valueProducts: null,
	requiredReceipt: false,
	isRatiable: false,
	tableData: [''],
	description: '',
	supplier: '',
	payments: [{ value: '', dueDate: null }],
	typeAccount: '',
	uploadedFiles: []
};

const schema = object().shape({
	paymentMethod: string().required('É necessário adicionar uma forma de pagamento.'),
	requiredReceipt: boolean(),
	isRatiable: boolean(),
	tableData: array()
		.of(string().required('É necessário adicionar um produto.'))
		.required('É necessário adicionar um produto.'),
	description: string().required('É necessário uma descrição.'),
	supplier: string().required('É necessário adicionar um fornecedor.'),
	payments: array()
		.of(
			object().shape({
				value: string().required('É necessário um valor.'),
				dueDate: date().nullable().required('É necessário adicionar uma data de vencimento.')
			})
		)
		.required(),
	typeAccount: string(),
	uploadedFiles: array()
});

export default function PaymentRequestFormGeneral() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useSelector(selectUser);
	const productsRedux = useSelector(selectProducts);
	const [productsToOptionsSelect, setProductsToOptionsSelect] = useState<ProductOptionType[]>([]);
	const [productToTable, setProductToTable] = useState<ProductOptionType>({ name: '' });
	const [cleanInputCreatable, setCleanInputCreatable] = useState(false);
	const [openTooltip, setOpenTooltip] = useState(false);
	const {
		control,
		handleSubmit,
		setValue,
		watch,
		register,
		reset,
		formState: { errors }
	} = useForm<FormDataProps>({
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'payments'
	});

	useEffect(() => {
		dispatch(getProducts());
	}, []);

	useEffect(() => {
		if (productsRedux.products.length > 0) {
			const refProducts = productsRedux.products
				.map(product => product.enable && { name: product.name })
				.filter(product => product);
			setProductsToOptionsSelect(refProducts);
		}
	}, [productsRedux]);

	function onSubmit(data: FormDataProps) {
		console.log(data);
		// const newRequest = {
		// 	description: data.description,
		// 	supplier: data.supplier,
		// 	requiredReceipt: data.requiredReceipt,
		// 	payments: data.payments
		// };
		// dispatch(createRequestPaymentGeneral(newRequest)).then(res => {
		// 	if (res.payload) {
		// 		clearFormState();
		// 		navigate('/');
		// 	}
		// });
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;
		const filesArray = Array.from(files || []);

		const newUploadedFiles = filesArray.map(file => file);
		const updatedUploadedFiles = [...watch('uploadedFiles'), ...newUploadedFiles];

		setValue('uploadedFiles', updatedUploadedFiles);
	};

	const handleFileRemove = (indexToRemove: number) => {
		const currentFiles = [...watch('uploadedFiles')];
		const updatedFiles = currentFiles.filter((_file, index) => index !== indexToRemove);
		setValue('uploadedFiles', updatedFiles);
	};

	function handleAddProducts() {
		const currentTableData = watch('tableData');

		setValue('tableData', [...currentTableData, { produtos: productToTable.name }]);
		setProductToTable({ name: '' });
		setCleanInputCreatable(!cleanInputCreatable);
	}

	function getDataFromCreatable(data: ProductOptionType | string) {
		if (typeof data === 'string') {
			setProductToTable({ name: data });
		} else if (typeof data === 'object') {
			setProductToTable(data);
		}
	}

	function clearFormState() {
		reset();
	}

	return (
		<Box className="flex flex-col w-full">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="p-32 mt-20"
			>
				<Button
					className="mb-12"
					variant="text"
					startIcon={<FuseSvgIcon>material-twotone:arrow_back_ios</FuseSvgIcon>}
				>
					SOLICITAÇÕES
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
						sx={{ color: theme => theme.palette.secondary.main }}
					>
						Abrir nova solicitação
					</Typography>
				</Paper>

				<Paper
					elevation={4}
					className="mt-24 p-36 flex flex-col gap-24"
				>
					<RequestUser user={user} />

					<Typography color="GrayText">Adicione os produtos para solicitação de pagamento</Typography>

					<div className="flex items-center gap-24 flex-col sm:flex-row">
						<CreatableOptions
							selectedData={getDataFromCreatable}
							products={productsToOptionsSelect}
							cleanInput={cleanInputCreatable}
							control={control}
							errors={errors}
						/>
						<Button
							className="w-full sm:w-256"
							onClick={handleAddProducts}
							sx={{ borderRadius: '7px' }}
							variant="contained"
							startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
						>
							ADICIONAR ITEM
						</Button>
					</div>
					<CustomizedTables
						tableHead={['PRODUTOS']}
						tableData={watch('tableData')}
					/>

					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								{...register('description')}
								error={!!errors.description}
								helperText={errors?.description?.message}
								rows={4}
								label="Descrição da solicitação"
								multiline
							/>
						)}
					/>

					<Controller
						name="supplier"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								{...register('supplier')}
								error={!!errors.supplier}
								helperText={errors?.supplier?.message}
								label="Fornecedor"
								placeholder="Digite um CPF ou CNPJ"
							/>
						)}
					/>
					<div className="flex flex-col w-full ">
						<div>
							{fields.map((field, index) => (
								<div
									className="my-24"
									key={field.id}
								>
									<ValueAndDueDate
										errors={errors}
										index={index}
										control={control}
										register={register}
										remove={remove}
									/>
								</div>
							))}
						</div>
						<div className="flex items-center ">
							<Tooltip
								placement="top-start"
								arrow
								title="Adicionar mais pagamentos."
								open={openTooltip}
							>
								<Button
									onClick={() => append({ value: '', dueDate: null })}
									className="rounded-4"
									variant="contained"
								>
									<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
									{watch('payments').length > 0
										? 'Adicionar mais pagamentos.'
										: 'Adicionar algum pagamento.'}
								</Button>
							</Tooltip>
						</div>
					</div>
					<PaymentMethod
						paymentMethod={watch('paymentMethod')}
						control={control}
						register={register}
						errors={errors}
					/>
					<AccountType
						paymentMethod={watch('paymentMethod')}
						control={control}
						register={register}
						accountType={watch('typeAccount')}
					/>

					<RequiredReceipt
						requiredReceipt={watch('requiredReceipt')}
						setToggleCheck={e => setValue('requiredReceipt', e)}
					/>

					<UploadFiles
						uploadedFiles={watch('uploadedFiles')}
						handleFileChange={handleFileChange}
						handleFileRemove={handleFileRemove}
					/>

					<IsRatiable
						isRatiable={watch('isRatiable')}
						setToggleRatiable={e => setValue('isRatiable', e)}
					/>

					<div className="flex justify-end gap-10 flex-col sm:flex-row">
						<Button
							variant="outlined"
							className="rounded-4"
							onClick={clearFormState}
						>
							CANCELAR
						</Button>
						<Button
							className="rounded-4"
							type="submit"
							variant="contained"
						>
							ENVIAR
						</Button>
					</div>
				</Paper>
			</form>
		</Box>
	);
}

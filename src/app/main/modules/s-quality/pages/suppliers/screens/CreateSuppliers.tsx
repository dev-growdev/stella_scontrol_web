import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { ISupplier } from '../types/supplier';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TSupplierRegistrationForm, supplierRegistrationFormSchema } from './validations/supplierRegistrationForm.schema'
import { log } from 'console';
import { useForm } from 'react-hook-form';

interface ICountry {
	code: string;
	label: string;
}

interface ICity {
	label: string;
}

interface IRegion {
	label: string;
}

const continents = [
	{ value: 'AFRICA', label: 'Africa'},
	{ value: 'ANTARCTICA', label: 'Antarctica'},
	{ value: 'ASIA', label: 'Asia'},
	{ value: 'EUROPE', label: 'Europe'},
	{ value: 'NORTH AMERICA', label: 'North America'},
	{ value: 'OCEANIA', label: 'Oceania'},
	{ value: 'SOUTH AMERICA', label: 'South America'},
];

const countries: readonly ICountry[] = [
	{ code: 'BR', label: 'Brazil'},
	{ code: 'ES', label: 'Spain'},
	{ code: 'US', label: 'United States'},
];

const citys: readonly ICity[] = [
	{ label: 'Novo Hamburgo'},
	{ label: 'Campo Bom'},
	{ label: 'Sapiranga'},
];

const regions: readonly IRegion[] = [
	{ label: 'Rio Grande do Sul'},
	{ label: 'São Paulo'},
	{ label: 'Rio de Janeiro'},
];

const defaultValues: TSupplierRegistrationForm = {
	name: '',
	email: '',
	continent: null,
	address: '',
	city: '',
	region: '',
	country: '',
	phone: '',
	contactName: '',	
};

export default function CreateSuppliers() {
	const [formDataSupplier, setFormDataSupplier] = useState<ISupplier>({
		name: '',
		email: '',
		continent: '',
		address: '',
		city: '',
		region: '',
		country: '',
		phone: '',
		contactName: '',
		enable: true
	});

	const navigate = useNavigate();
	const {
		control,
		handleSubmit,
		setValue,
		watch,
		register,
		reset,
		formState: { errors },
		setError,
		clearErrors,
		unregister
	} = useForm<TSupplierRegistrationForm>({
		defaultValues,
		resolver: zodResolver(supplierRegistrationFormSchema)
	});

	


	const clearStates = () => {
		setFormDataSupplier({
			name: '',
			email: '',
			continent: '',
			address: '',
			city: '',
			region: '',
			country: '',
			phone: '',
			contactName: '',
			enable: true
		});
			
	};

	const handleSubmitCreate = async () => {
		const supplierData = {
			name: formDataSupplier.name,
			email: formDataSupplier.email,
			continent: formDataSupplier.continent,
			city: formDataSupplier.city,
			region: formDataSupplier.region,
			country: formDataSupplier.country,
			address: formDataSupplier.address,
			phone: formDataSupplier.phone,
			contactName: formDataSupplier.contactName,
			enable: formDataSupplier.enable
		};

		// salva fornecedor
		console.log(supplierData);
		
		clearStates();
	};

	const handlePropertiesChange = (field, value: string) => {
		setFormDataSupplier({
			...formDataSupplier,
			[field]: value
		});
	};

	const handleRedirectToSuppliers = () => {
		navigate('/squality/fornecedores');
	}

	
	return (
		<Box className="flex flex-col w-full">
			<div className="p-32 mt-20">
				<Button
					className="mb-12"
					variant="text"
					startIcon={<FuseSvgIcon>material-twotone:arrow_back_ios</FuseSvgIcon>}
					onClick={handleRedirectToSuppliers}
				>
					SUPPLIERS
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
						Register Supplier
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
								sm={6}
							>
								<TextField
									fullWidth
									required
									value={formDataSupplier.name}
									onChange={e => handlePropertiesChange('name', e.target.value)}
									label="Name"
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									fullWidth
									required
									value={formDataSupplier.email}
									onChange={e => handlePropertiesChange('email', e.target.value)}
									label="Email"
								/>
							</Grid>
						</Grid>
					</div>

					<div className="flex flex-col w-full gap-24">
						<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">
							
							<TextField
								fullWidth
								value={formDataSupplier.phone}
								onChange={e => handlePropertiesChange('phone', e.target.value)}
								label="Phone"
							/>
							<TextField
								fullWidth
								value={formDataSupplier.contactName}
								onChange={e => handlePropertiesChange('contactName', e.target.value)}
								label="Contact name"
							/>
						
						</div>
					</div>

					<div className="flex flex-col w-full gap-24">
						<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">
							<TextField
								fullWidth
								id="outlined-select-continent"
								select
								required
								label="Select"
								defaultValue="Select continent"
								helperText="Please select continent"
								onChange={e => handlePropertiesChange('continent', e.target.value)}
								>
								{continents.map((option) => (
									<MenuItem key={option.value} value={option.value}>
									{option.label}
									</MenuItem>
								))}
							</TextField>

							<Autocomplete
								fullWidth
								id="country-select-demo"
								options={countries}
								autoHighlight
								getOptionLabel={(option) => option.label}
								renderOption={(props, option) => (
									<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
									  <img
										loading="lazy"
										width="20"
										srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
										src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
										alt=""
									  />
									  {option.label} ({option.code})
									</Box>
								  )}
								  renderInput={(params) => (
									<TextField
										fullWidth
									  	{...params}
										label="Choose a country"
										inputProps={{
											...params.inputProps,
											autoComplete: 'new-password', // disable autocomplete and autofill
										}}
									/>
								  )}
							/>

							{/* <TextField
								fullWidth
								value={formDataSupplier.country}
								onChange={e => handlePropertiesChange('country', e.target.value)}
								label="Country"
							/> */}
							
							
						</div>
					</div>

					<div className="flex flex-col w-full gap-24">
						<div className="flex flex-col sm:flex-row gap-24 w-full justify-between">

							<TextField
								fullWidth
								value={formDataSupplier.address}
								onChange={e => handlePropertiesChange('address', e.target.value)}
								label="Address"
							/>

							<Autocomplete
								fullWidth
								id="city-select-demo"
								options={citys}
								autoHighlight
								getOptionLabel={(option) => option.label}
								renderOption={(props, option) => (
									<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
					
									  {option.label}
									</Box>
								  )}
								  renderInput={(params) => (
									<TextField
										fullWidth
									  	{...params}
										label="Choose a city"
										inputProps={{
											...params.inputProps,
											autoComplete: 'new-password', // disable autocomplete and autofill
										}}
									/>
								  )}
							/>

							{/* <TextField
								fullWidth
								value={formDataSupplier.city}
								onChange={e => handlePropertiesChange('city', e.target.value)}
								label="City"
							/> */}

							<Autocomplete
								fullWidth
								id="region-select-demo"
								options={regions}
								autoHighlight
								getOptionLabel={(option) => option.label}
								renderOption={(props, option) => (
									<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
									  {option.label}
									</Box>
								  )}
								  renderInput={(params) => (
									<TextField
										fullWidth
									  	{...params}
										label="Choose a region"
										inputProps={{
											...params.inputProps,
											autoComplete: 'new-password', // disable autocomplete and autofill
										}}
									/>
								  )}
							/>
							
							{/* <TextField
								fullWidth
								value={formDataSupplier.region}
								onChange={e => handlePropertiesChange('region', e.target.value)}
								label="Region"
							/> */}

							
						</div>
					</div>

					

					<div className="flex justify-end gap-10 flex-col sm:flex-row">
						<Button
							variant="outlined"
							onClick={clearStates}
						>
							CANCEL
						</Button>
						<Button
							variant="contained"
							onClick={handleSubmitCreate}
							type='submit'
							disabled
						>
							SUBMIT
						</Button>
					</div>
				</Paper>
			</div>
		</Box>
	);
}

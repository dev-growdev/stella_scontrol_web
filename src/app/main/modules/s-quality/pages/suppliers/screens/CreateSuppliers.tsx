import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TSupplierRegistrationForm, supplierRegistrationFormSchema } from './validations/supplierRegistrationForm.schema'
import { log } from 'console';
import { Controller, useForm } from 'react-hook-form';
import { useDispatchSQuality } from '~/modules/s-quality/store/hooks';
import { createSupplier } from '../store/suppliersSlice';
import { ISupplier } from '../types/supplier';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const optionsContinents = [
	{ value: 'Africa', label: 'Africa'},
	{ value: 'Antarctica', label: 'Antarctica'},
	{ value: 'Asia', label: 'Asia'},
	{ value: 'Europe', label: 'Europe'},
	{ value: 'North America', label: 'North America'},
	{ value: 'Oceania', label: 'Oceania'},
	{ value: 'South America', label: 'South America'},
];

const optionsCountries = [
	{ code: 'BR', label: 'Brazil', value: 'Brazil'},
	{ code: 'ES', label: 'Spain', value: 'Spain'},
	{ code: 'US', label: 'United States', value: 'United States'},
];

const optionsCities = [
	{ value: 'Novo Hamburgo', label: 'Novo Hamburgo'},
	{ value: 'Campo Bom', label: 'Campo Bom'},
	{ value: 'Sapiranga', label: 'Sapiranga'},
];

const optionsRegions = [
	{ value: 'Rio Grande do Sul', label: 'Rio Grande do Sul'},
	{ value: 'São Paulo', label: 'São Paulo'},
	{ value: 'Rio de Janeiro', label: 'Rio de Janeiro'},
];

const defaultValues: TSupplierRegistrationForm = {
	name: '',
	email: '',
	continent: '' as TSupplierRegistrationForm['continent'],
	address: '',
	city: '',
	region: '',
	country: '',
	phone: '',
	contactName: '',
	enable: true	
};

export default function CreateSuppliers() {
	const dispatchSQuality = useDispatchSQuality();
	const [continentInputValue, setContinentInputValue] = useState('');
	const [countryInputValue, setCountryInputValue] = useState('');
	const [cityInputValue, setCityInputValue] = useState('');
	const [regionInputValue, setRegionInputValue] = useState('');
	const {control, handleSubmit, reset, formState: {errors, isDirty, isValid}} = useForm<TSupplierRegistrationForm>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(supplierRegistrationFormSchema)
	});

	const navigate = useNavigate();

	function onSubmit(data: TSupplierRegistrationForm) {
		dispatchSQuality(createSupplier(data as ISupplier));
	}

	function handleReset() {
		reset(defaultValues);
	}

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
					<form
						onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
						onReset={handleReset}
					>
						<FormGroup>
							<FormControlLabel
								label=''
								control={
								<Controller
									name="enable"
									control={control}
									defaultValue={true}
									render={({ field }) => (
										<>
											<Switch {...field} defaultChecked color='primary' />
											<Typography>{field.value ? 'Desativar': 'Ativar'}</Typography>
										</>
									)}
								/>
								}
							/>					
						</FormGroup>		
						<div className="flex flex-col gap-24 sm:flex-row">
							<Grid
								container
								spacing={3}
							>
								<Grid
									item
									xs={12}
									sm={6}
									className='mb-24'
								>
									<Controller
										control={control}
										name='name'
										render={({field})=> <TextField
											{...field}
											fullWidth
											required								
											label="Name"
											error={!!errors.name}
											helperText={errors.name?.message}
										/>}
									/>								
								</Grid>
								<Grid
									item
									xs={12}
									sm={6}
									className='mb-24'
								>
									<Controller
										control={control}
										name='email'
										render={({field})=> <TextField
											{...field}
											fullWidth
											required
											label="Email"
											error={!!errors.email}
											helperText={errors.email?.message}
										/>}
									/>	
								</Grid>
							</Grid>
						</div>
						<div className="flex flex-col w-full gap-24">
							<div className="flex flex-col sm:flex-row gap-24 w-full justify-between mb-24">
								<Controller
									control={control}
									name='phone'
									render={({field})=> <TextField
										{...field}
										fullWidth
										label="Phone"
										error={!!errors.phone}
										helperText={errors.phone?.message}
									/>}
								/>
								<Controller
									control={control}
									name='contactName'
									render={({field})=> <TextField
									{...field}
									fullWidth
									label="Contact name"
									error={!!errors.contactName}
									helperText={errors.contactName?.message}
									/>}
								/>
							</div>
						</div>
						<div className="flex flex-col w-full gap-24">
							<div className="flex flex-col sm:flex-row gap-24 w-full justify-between mb-24">
								<Controller
									control={control}
									name='continent'
									render={({ field, fieldState }) => (
										<Autocomplete
											fullWidth
											options={optionsContinents}
											getOptionLabel={(option) => option.label}
											isOptionEqualToValue={(option, value) =>
												option.value === value.value
											}
											inputValue={continentInputValue}
											onInputChange={(e, value) => setContinentInputValue(value)}
											onChange={(_, value) => {
												field.onChange(value?.value);
											}}
											value={optionsContinents.find(
												(option) => option.value === field.value,
											)}
											renderInput={(params) => (
												<TextField
													{...params}
													label='Continent'
													required
													error={fieldState.invalid}
													helperText={fieldState.error?.message}
												/>
											)}
										/>
									)}
								/>
								<Controller
									control={control}
									name='country'
									render={({ field, fieldState }) => (
										<Autocomplete
											fullWidth
											options={optionsCountries}
											getOptionLabel={(option) => option.label}
											isOptionEqualToValue={(option, value) =>
												option.value === value.value
											}
											inputValue={countryInputValue}
											onInputChange={(e, value) => setCountryInputValue(value)}
											onChange={(_, value) => {
												field.onChange(value?.value);
											}}
											value={optionsCountries.find(
												(option) => option.value === field.value,
											)}
											renderInput={(params) => (
												<TextField
													{...params}
													label='Country'
													error={fieldState.invalid}
													helperText={fieldState.error?.message}
												/>
											)}
										/>
									)}
								/>
								{/* <Autocomplete
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
								/> */}								
							</div>
						</div>
						<div className="flex flex-col w-full gap-24">
							<div className="flex flex-col sm:flex-row gap-24 w-full justify-between mb-24">
								<Controller
									control={control}
									name='address'
									render={({field})=> <TextField
										{...field}
										fullWidth							
										label="Address"
										error={!!errors.address}
										helperText={errors.address?.message}
									/>}
								/>
								<Controller
									control={control}
									name='city'
									render={({ field, fieldState }) => (
										<Autocomplete
											fullWidth
											options={optionsCities}
											getOptionLabel={(option) => option.label}
											isOptionEqualToValue={(option, value) =>
												option.value === value.value
											}
											inputValue={cityInputValue}
											onInputChange={(e, value) => setCityInputValue(value)}
											onChange={(_, value) => {
												field.onChange(value?.value);
											}}
											value={optionsCities.find(
												(option) => option.value === field.value,
											)}
											renderInput={(params) => (
												<TextField
													{...params}
													label='City'
													error={fieldState.invalid}
													helperText={fieldState.error?.message}
												/>
											)}
										/>
									)}
								/>
								<Controller
									control={control}
									name='region'
									render={({ field, fieldState }) => (
										<Autocomplete
											fullWidth
											options={optionsRegions}
											getOptionLabel={(option) => option.label}
											isOptionEqualToValue={(option, value) =>
												option.value === value.value
											}
											inputValue={regionInputValue}
											onInputChange={(e, value) => setRegionInputValue(value)}
											onChange={(_, value) => {
												field.onChange(value?.value);
											}}
											value={optionsRegions.find(
												(option) => option.value === field.value,
											)}
											renderInput={(params) => (
												<TextField
													{...params}
													label='Region'
													error={fieldState.invalid}
													helperText={fieldState.error?.message}
												/>
											)}
										/>
									)}
								/>
							</div>
						</div>
						<div className="flex justify-end gap-10 flex-col sm:flex-row">
							<Button
								variant="outlined"
								type='reset'
							>
								CANCEL
							</Button>
							<Button
								variant="contained"
								type='submit'
								disabled={!isValid || !isDirty}
							>
								SUBMIT
							</Button>
						</div>
					</form>
				</Paper>
			</div>
		</Box>
	);
}

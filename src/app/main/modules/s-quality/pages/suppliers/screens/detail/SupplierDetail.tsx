import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';

import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  TSupplierRegistrationForm,
  supplierRegistrationFormSchema
} from '../validations/supplierRegistrationForm.schema';
import { useDispatchSQuality } from '~/modules/s-quality/store/hooks';
import { createSupplier } from '../../store/suppliersSlice';
import { i18nBR, i18nEN } from './i18n';
import { TextFieldControlled } from '~/shared/components/forms/TextFieldControlled';
import { AutocompleteControlled } from '~/shared/components/forms/AutocompleteControlled';

const optionsContinents = [
  { value: 'Africa', label: 'Africa' },
  { value: 'Antarctica', label: 'Antarctica' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Europe', label: 'Europe' },
  { value: 'North America', label: 'North America' },
  { value: 'Oceania', label: 'Oceania' },
  { value: 'South America', label: 'South America' }
];

const optionsCountries = [
  { code: 'BR', label: 'Brazil', value: 'Brazil' },
  { code: 'ES', label: 'Spain', value: 'Spain' },
  { code: 'US', label: 'United States', value: 'United States' }
];

const optionsCities = [
  { value: 'Novo Hamburgo', label: 'Novo Hamburgo' },
  { value: 'Campo Bom', label: 'Campo Bom' },
  { value: 'Sapiranga', label: 'Sapiranga' }
];

const optionsRegions = [
  { value: 'Rio Grande do Sul', label: 'Rio Grande do Sul' },
  { value: 'São Paulo', label: 'São Paulo' },
  { value: 'Rio de Janeiro', label: 'Rio de Janeiro' }
];

const defaultValues: TSupplierRegistrationForm = {
  name: '',
  email: '',
  continent: '' as TSupplierRegistrationForm['continent'],
  address: '',
  city: '',
  region: '',
  country: '',
  phoneNumber: '',
  contactName: '',
  enable: 'true'
};
const i18nKey = 'supplierDetail';
i18next.addResourceBundle('br', i18nKey, i18nBR);
i18next.addResourceBundle('en', i18nKey, i18nEN);
export default function SupplierDetail() {
  const { t } = useTranslation(i18nKey);
  const dispatchSQuality = useDispatchSQuality();
  const [countryInputValue, setCountryInputValue] = useState('');
  const [cityInputValue, setCityInputValue] = useState('');
  const [regionInputValue, setRegionInputValue] = useState('');
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm<TSupplierRegistrationForm>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(supplierRegistrationFormSchema)
  });

  const navigate = useNavigate();

  async function onSubmit(data: TSupplierRegistrationForm) {
    const { payload } = await dispatchSQuality(createSupplier({ ...data, enable: data.enable === 'true' }));
    // @ts-expect-error - payload always return unknown
    if ('success' in payload) return;
    handleReset();
  }

  function handleReset() {
    reset(defaultValues);
  }

  function handleRedirectToSuppliers() {
    navigate('/squality/suppliers');
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
          {t('SUPPLIERS')}
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
            {t('REGISTER_SUPPLIER')}
          </Typography>
        </Paper>
        <Paper
          elevation={4}
          className="mt-24 p-36 flex flex-col gap-24"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            onReset={handleReset}
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
                  className="mb-24"
                >
                  <TextFieldControlled
                    required
                    fullWidth
                    control={control}
                    name="name"
                    label={t('NAME')}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  className="mb-24"
                >
                  <TextFieldControlled
                    required
                    fullWidth
                    control={control}
                    name="email"
                    label={t('EMAIL')}
                  />
                </Grid>
              </Grid>
            </div>
            <div className="flex flex-col w-full gap-24">
              <div className="flex flex-col sm:flex-row gap-24 w-full justify-between mb-24">
                <TextFieldControlled
                  fullWidth
                  control={control}
                  name="phoneNumber"
                  label={t('PHONE')}
                />

                <TextFieldControlled
                  fullWidth
                  control={control}
                  name="contactName"
                  label={t('CONTACT_NAME')}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-24">
              <div className="flex flex-col sm:flex-row gap-24 w-full justify-between mb-24">
                <AutocompleteControlled
                  fullWidth
                  required
                  control={control}
                  name="continent"
                  label={t('CONTINENT')}
                  options={optionsContinents}
                  noOptionsText={t('CONTINENT.NO_OPTIONS')}
                />
                <AutocompleteControlled
                  fullWidth
                  control={control}
                  name="country"
                  label={t('COUNTRY')}
                  options={optionsCountries}
                  noOptionsText={t('COUNTRY.NO_OPTIONS')}
                />

                <AutocompleteControlled
                  fullWidth
                  control={control}
                  name="region"
                  label={t('REGION')}
                  options={optionsRegions}
                  noOptionsText={t('REGION.NO_OPTIONS')}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-24">
              <div className="flex flex-col sm:flex-row gap-24 w-full justify-between mb-24">
                <TextFieldControlled
                  fullWidth
                  control={control}
                  name="address"
                  label={t('ADDRESS')}
                />

                <AutocompleteControlled
                  fullWidth
                  control={control}
                  name="city"
                  label={t('CITY')}
                  options={optionsCities}
                  noOptionsText={t('CITY.NO_OPTIONS')}
                />

                <Controller
                  control={control}
                  name="enable"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="status-select-label">{t('STATUS')}</InputLabel>
                      <Select
                        labelId="status-select-label"
                        fullWidth
                        {...field}
                        label={t('STATUS')}
                      >
                        <MenuItem value="true">{t('ENABLE')}</MenuItem>
                        <MenuItem value="false">{t('DISABLE')}</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end gap-10 flex-col sm:flex-row">
              <Button
                variant="outlined"
                type="reset"
              >
                {t('CANCEL')}
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={!isValid || !isDirty}
              >
                {t('SUBMIT')}
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </Box>
  );
}

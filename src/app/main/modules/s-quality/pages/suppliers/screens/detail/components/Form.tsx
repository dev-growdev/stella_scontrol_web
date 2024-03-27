import type { TFunction } from 'i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Grid, Paper } from '@mui/material';

import { useDispatchSQuality } from '~/modules/s-quality/store/hooks';
import { TextFieldControlled } from '~/shared/components/forms/TextFieldControlled';
import { AutocompleteControlled } from '~/shared/components/forms/AutocompleteControlled';
import {
  TSupplierRegistrationForm,
  supplierRegistrationFormSchema,
  defaultValues
} from '../../validations/supplierRegistrationForm.schema';
import { optionsAutocomplete } from './mocks/form';
import { createSupplier } from '../../../store/suppliersSlice';
import { SelectControlled } from '~/shared/components/forms/SelectControlled';

interface PropsFormSupplier {
  t: TFunction;
}

export function FormSupplier({ t }: PropsFormSupplier) {
  const dispatchSQuality = useDispatchSQuality();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid }
  } = useForm<TSupplierRegistrationForm>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(supplierRegistrationFormSchema)
  });

  async function onSubmit(data: TSupplierRegistrationForm) {
    const { payload } = await dispatchSQuality(createSupplier({ ...data, enable: data.enable === 'true' }));
    // @ts-expect-error - payload always return unknown
    if ('success' in payload) return;
    handleReset();
  }

  function handleReset() {
    reset(defaultValues);
  }
  return (
    <Paper elevation={4} className="mt-24 p-36 flex flex-col gap-24">
      <Grid container component="form" onSubmit={handleSubmit(onSubmit)} onReset={handleReset} spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextFieldControlled required fullWidth control={control} name="name" label={t('NAME')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldControlled required fullWidth control={control} name="email" label={t('EMAIL')} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextFieldControlled fullWidth control={control} name="phoneNumber" label={t('PHONE')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldControlled fullWidth control={control} name="contactName" label={t('CONTACT_NAME')} />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AutocompleteControlled
            fullWidth
            required
            control={control}
            name="continent"
            label={t('CONTINENT')}
            options={optionsAutocomplete.continents}
            noOptionsText={t('CONTINENT.NO_OPTIONS')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AutocompleteControlled
            fullWidth
            control={control}
            name="country"
            label={t('COUNTRY')}
            options={optionsAutocomplete.countries}
            noOptionsText={t('COUNTRY.NO_OPTIONS')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AutocompleteControlled
            fullWidth
            control={control}
            name="region"
            label={t('REGION')}
            options={optionsAutocomplete.regions}
            noOptionsText={t('REGION.NO_OPTIONS')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextFieldControlled control={control} name="address" fullWidth label={t('ADDRESS')} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AutocompleteControlled
            fullWidth
            control={control}
            name="city"
            label={t('CITY')}
            options={optionsAutocomplete.cities}
            noOptionsText={t('CITY.NO_OPTIONS')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SelectControlled
            control={control}
            name="enable"
            label={t('STATUS')}
            options={[
              { label: t('ENABLE'), value: 'true' },
              { label: t('DISABLE'), value: 'false' }
            ]}
          />
        </Grid>

        <Grid item xs={12} className="flex justify-end gap-16">
          <Button variant="outlined" type="reset">
            {t('CANCEL')}
          </Button>
          <Button variant="contained" type="submit" disabled={!isValid || !isDirty}>
            {t('SUBMIT')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

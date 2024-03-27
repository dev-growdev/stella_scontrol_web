import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { i18nBR, i18nEN } from './i18n';
import { DefaultPage } from '~/modules/s-quality/components/DefaultPage';
import { FormSupplier, HeaderFormSupplier } from './components';

const i18nKey = 'supplierDetail';
i18next.addResourceBundle('br', i18nKey, i18nBR);
i18next.addResourceBundle('en', i18nKey, i18nEN);
export default function SupplierDetail() {
  const { t } = useTranslation(i18nKey);

  return (
    <DefaultPage>
      <HeaderFormSupplier t={t} />
      <FormSupplier t={t} />
    </DefaultPage>
  );
}

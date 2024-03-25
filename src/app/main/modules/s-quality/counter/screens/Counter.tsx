import { Button } from '@mui/material';
import { useEffect } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { useDispatchSQuality, useSelectorSQuality } from '../../store/hooks';
import { decrement, increment, selectCount, setLoading } from '../../store/slices/counterSlice';
import { i18nBR, i18nEN } from '../i18n';

i18next.addResourceBundle('br', 'counter', i18nBR);
i18next.addResourceBundle('en', 'counter', i18nEN);

export function Counter() {
  const { t } = useTranslation('counter');
  const counter = useSelectorSQuality(selectCount);
  const dispatchSQuality = useDispatchSQuality();

  useEffect(() => {
    dispatchSQuality(setLoading(true));
    setTimeout(() => {
      dispatchSQuality(setLoading(false));
    }, 2000);
  }, []);

  return counter.loading ? (
    <div className="flex h-full  justify-center items-center">
      <p className="text-xl font-bold p-10">{t('LOADING')}</p>
    </div>
  ) : (
    <div className="flex h-full  justify-center items-center">
      <Button
        variant="contained"
        type="button"
        onClick={() => dispatchSQuality(decrement())}
      >
        {t('DECREMENT')}
      </Button>

      <p className="text-xl p-10">{counter.value}</p>
      <Button
        type="button"
        variant="contained"
        onClick={() => dispatchSQuality(increment())}
      >
        {t('INCREMENT')}
      </Button>
    </div>
  );
}

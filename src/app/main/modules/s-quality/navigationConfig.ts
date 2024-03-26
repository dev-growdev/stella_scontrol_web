import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';
import i18next from 'i18next';

import { i18nBR, i18nEN } from './_navigation-i18n';

i18next.addResourceBundle('br', 'navigation', i18nBR);
i18next.addResourceBundle('en', 'navigation', i18nEN);

export const SQualityNavigationConfig: FuseNavigationType = [
  {
    id: 'squality.home',
    title: 'Inicio',
    type: 'item',
    translate: 'HOME',
    icon: 'heroicons-outline:clipboard-list',
    url: 'squality'
  },
  {
    id: 'squality.exemplo',
    title: 'Exemplo',
    type: 'collapse',
    icon: 'heroicons-outline:clock',
    translate: 'EXAMPLE',
    children: [
      {
        id: 'squality.exemplo.counter',
        title: 'Contador',
        type: 'item',
        translate: 'EXAMPLE.COUNTER',
        icon: 'heroicons-outline:cube',
        url: 'squality/counter'
      }
    ]
  },
  {
    id: 'squality.create.list',
    title: 'Cadastros',
    type: 'collapse',
    icon: 'heroicons-outline:clock',
    children: [
      {
        id: 'squality.create.suppliers',
        title: 'Suppliers',
        type: 'item',
        icon: 'heroicons-outline:cube',
        url: 'squality/suppliers'
      }
    ]
  }
];

import i18next from 'i18next';
import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';
import { i18nEN } from './navigation-i18n/en';
import { i18nPTBR } from './navigation-i18n/ptbr';
import { SControlNavigationConfig } from '../main/modules/s-control/navigationConfig';
import { SQualityNavigationConfig } from '../main/modules/s-quality/navigationConfig';

i18next.addResourceBundle('en', 'navigation', i18nEN);
i18next.addResourceBundle('ptbr', 'navigation', i18nPTBR);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */

const navigationConfig: Record<string, FuseNavigationType> = {
  scontrol: SControlNavigationConfig,
  squality: SQualityNavigationConfig
};

const path = window.location.pathname.split('/')[1];
const config = navigationConfig[path] || SControlNavigationConfig;

export default config;

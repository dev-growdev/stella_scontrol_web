import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';
import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import { SControlNavigationConfig } from '../main/modules/s-control/navigationConfig';
import { SQualityNavigationConfig } from '../main/modules/s-quality/navigationConfig';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */

const navigationConfig: FuseNavigationType = [...SControlNavigationConfig, ...SQualityNavigationConfig];

export default navigationConfig;

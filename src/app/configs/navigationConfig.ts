import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';
import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavigationType = [
	{
		id: 'clipboard-list',
		title: 'Solicitações',
		type: 'item',
		icon: 'heroicons-outline:clipboard-list',
		url: 'example'
	},
	{
		id: 'document-add',
		title: 'Nova Solicitação',
		type: 'item',
		icon: 'heroicons-outline:document-add',
		url: 'example'
	},
	{
		id: 'clock',
		title: 'Cadastros',
		type: 'item',
		icon: 'heroicons-outline:clock',
		url: 'example'
	},
	{
		id: 'cog',
		title: 'Configurações',
		type: 'item',
		icon: 'heroicons-outline:cog',
		url: 'example'
	},
];

export default navigationConfig;

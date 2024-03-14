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
		url: 'solicitacoes'
	},
	{
		id: 'document-add',
		title: 'Nova Solicitação',
		type: 'item',
		icon: 'heroicons-outline:document-add',
		url: 'solicitar-pagamento'
	},
	{
		id: 'clock',
		title: 'Cadastros',
		type: 'collapse',
		icon: 'heroicons-outline:clock',
		children: [
			{
				id: 'cube2',
				title: 'Produtos',
				type: 'collapse',
				icon: 'heroicons-outline:cube',
				url: 'produtos'
			},
			{
				id: 'tag2',
				title: 'Categorias',
				type: 'item',
				icon: 'heroicons-outline:tag',
				url: 'categorias'
			},
			{
				id: 'briefcase',
				title: 'Formas de pagamento',
				type: 'item',
				icon: 'heroicons-outline:briefcase',
				url: 'formas-de-pagamento'
			}
		]
	}
];

export default navigationConfig;

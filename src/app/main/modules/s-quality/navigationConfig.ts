import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';

export const SQualityNavigationConfig: FuseNavigationType = [
	{
		id: 'squality',
		title: 'S.Quality',
		subtitle: 'Sistema de qualidade',
		type: 'group',
		auth: ['squality'],
		children: [
			{
				id: 'home',
				title: 'Inicio',
				type: 'item',
				icon: 'heroicons-outline:clipboard-list',
				url: 'squality'
			},
			{
				id: 'document-add',
				title: 'Nova Solicitação',
				type: 'item',
				icon: 'heroicons-outline:document-add',
				url: 'solicitar-pagamento',
				auth: ['squality.novo']
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
						type: 'item',
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
		]
	}
];

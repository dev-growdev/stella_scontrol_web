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
				id: 'squality.home',
				title: 'Inicio',
				type: 'item',
				icon: 'heroicons-outline:clipboard-list',
				url: 'squality'
			},
			{
				id: 'squality.exemplo',
				title: 'Exemplo',
				type: 'collapse',
				icon: 'heroicons-outline:clock',
				children: [
					{
						id: 'squality.exemplo.counter',
						title: 'Contador',
						type: 'item',
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
		]
	}
];

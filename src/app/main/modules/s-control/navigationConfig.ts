import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';

export const SControlNavigationConfig: FuseNavigationType = [
	{
		id: 'scontrol',
		title: 'S.Control',
		subtitle: 'Sistema de Controle',
		type: 'group',
		auth: ['scontrol'],
		children: [
			{
				id: 'scontrol.request',
				title: 'Solicitações',
				type: 'item',
				icon: 'heroicons-outline:clipboard-list',
				url: 'scontrol/solicitacoes'
			},
			{
				id: 'scontrol.request.new',
				title: 'Nova Solicitação',
				type: 'item',
				icon: 'heroicons-outline:document-add',
				url: 'scontrol/solicitar-pagamento'
			},
			{
				id: 'scontrol.cadastros',
				title: 'Cadastros',
				type: 'collapse',
				icon: 'heroicons-outline:clock',
				children: [
					{
						id: 'cube2',
						title: 'Produtos',
						type: 'item',
						icon: 'heroicons-outline:cube',
						url: 'scontrol/produtos'
					},
					{
						id: 'tag2',
						title: 'Categorias',
						type: 'item',
						icon: 'heroicons-outline:tag',
						url: 'scontrol/categorias'
					},
					{
						id: 'briefcase',
						title: 'Formas de pagamento',
						type: 'item',
						icon: 'heroicons-outline:briefcase',
						url: 'scontrol/formas-de-pagamento'
					}
				]
			}
		]
	}
];

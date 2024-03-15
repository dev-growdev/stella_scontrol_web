import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';

const defaultSettings = {
	layout: {
		config: {
			navbar: {
				display: true
			},
			toolbar: {
				display: true
			},
			footer: {
				display: false
			},
			leftSidePanel: {
				display: false
			},
			rightSidePanel: {
				display: false
			}
		}
	}
};

export function addPrefixToRoutes(prefix: string, configs: FuseRouteConfigType[]): FuseRouteConfigType[] {
	const newRoutes = configs.map(config => {
		const { routes, settings, ...rest } = config;
		return {
			...rest,
			settings: settings || defaultSettings,
			routes: routes.map(route => {
				const sanitizedPath = route.path.replace(/^\//, '');
				return {
					...route,
					path: `/${prefix}/${sanitizedPath}`
				};
			})
		};
	});

	return newRoutes;
}

export interface CategoryType {
	uid: string;
	name: string;
	enable: boolean;
	action?: string;
}

export interface CategoriesType {
	categories: CategoryType[];
	loading: boolean;
}

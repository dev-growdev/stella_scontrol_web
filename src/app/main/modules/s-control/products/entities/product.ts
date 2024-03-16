import { CategoryType } from '../../categories/entities/category';

export interface FormProductType {
	uid?: string;
	code?: number;
	name: string;
	enable?: boolean;
	category: CategoryType | string;
	description?: string;
	quantity: string | number;
	measurement: string;
}

export interface ProductType {
	uid?: string;
	code?: number;
	name: string;
	enable: boolean;
	measurement?: string;
	description?: string;
	quantity?: number;
	category?: CategoryType;
}

export interface ProductsType {
	products: ProductType[];
	loading: boolean;
}

export interface CreateProductType {
	categoryId: string;
	name: string;
	enable: boolean;
	description?: string;
	measurement?: string;
	quantity?: number;
}

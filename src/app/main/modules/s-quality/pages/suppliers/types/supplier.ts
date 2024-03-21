export interface ISupplier {
	name: string;
	email: string;
	continent: string;
	address?: string; // utilização de api para buscar a lista de cidade, região e país
	city?: string;
	region?: string;
	country?: string;
	phone?: string;
	contactName?: string;
	enable: boolean;
}


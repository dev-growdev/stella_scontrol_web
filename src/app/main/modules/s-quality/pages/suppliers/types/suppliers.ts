export interface ISupplier {
	name: string;
	email: string;
	phone?: string;
	address?: string; // utilização de api para buscar a lista de cidade, região e país
	continent: string;
	contactName: string;
	enable: boolean; // ativo -> enable ou status?
}


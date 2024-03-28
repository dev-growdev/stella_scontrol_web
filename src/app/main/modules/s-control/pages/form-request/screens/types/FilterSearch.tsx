export interface ISearchFilter {
	type?: string[];
	status?: string[];
	createdAt?: { from?: Date | null; to?: Date | null };
	dueDate?: { from?: Date | null; to?: Date | null };
	supplier?: string;
}

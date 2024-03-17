interface Payment {
	value: string;
	dueDate: Date;
}

interface Files {
	uid: string;
	name: string;
	key: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateRequestGeneralType {
	supplier: string;
	description: string;
	requiredReceipt: boolean;
	uploadedFiles: File[];
	totalValue: string;
	accountingAccount: string;
	payments: Payment[];
}

export interface RequestType {
	uid: string;
	supplier: string;
	description?: string;
	sendReceipt: boolean;
	totalValue: string;
	accountingAccount: string;
	payments: Payment[];
	createdAt: Date;
	files: Files[];
}

export interface RequestPaymentGeneralType {
	loading: boolean;
	requests: RequestType[];
}

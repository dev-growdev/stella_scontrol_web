interface IFiles {
	uid: string;
	name: string;
	key: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreateRequestGeneralType {
	supplier: string;
	description: string;
	requiredReceipt: boolean;
	uploadedFiles: File[];
	totalValue: string;
	accountingAccount: string;
	payments: Payment[];
}

export interface IRequestType {
	paymentMethod: string;
	uid: string;
	Apportionments: any[];
	supplier: string;
	description?: string;
	requiredReceipt: boolean;
	totalValue: string;
	accountingAccount: string;
	payments: IPaymentRequestForm[];
	createdAt: Date;
	files: IFiles[];
	cardHolder: any;
	isRateable: boolean;
}

export interface IPaymentRequestForm {
	name: string;
	dueDate: Date;
}

export interface RequestPaymentGeneralType {
	loading: boolean;
	payload: IRequestType[];
}

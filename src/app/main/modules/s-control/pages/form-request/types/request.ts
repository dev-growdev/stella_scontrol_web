import { ProductType } from '../../products/types/product';

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
	sendReceipt: boolean;
	uploadedFiles: File[];
	totalValue: string;
	accountingAccount: string;
	payments: IPaymentRequestForm[];
}

export interface IPaymentForm {
	uid: string;
	name: string;
}

export interface ICardHolder {
	uid: string;
	name: string;
	code: number;
}
export interface IRequestType {
	PaymentForm: IPaymentForm;
	uid: string;
	Apportionments: any[];
	supplier: string;
	bankTransfer: string;
	description?: string;
	sendReceipt: boolean;
	totalValue: string;
	pix: string;
	accountingAccount: string;
	payments: IPaymentRequestForm[];
	createdAt: Date;
	files: IFiles[];
	CardHolder: ICardHolder;
	isRateable: boolean;
	Products: ProductType[];
	unregisteredProducts: string[];
}

export interface IPaymentRequestForm {
	value: string;
	dueDate: Date;
}

export interface RequestPaymentGeneralType {
	loading: boolean;
	payload: IRequestType[];
}

import { ProductType } from '../../products/types/product';

export interface IFiles {
	uid: string;
	name: string;
	key: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreateRequestGeneral {
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

export interface IApportionment {
	accountingAccount: string;
	costCenter: string;
	paymentRequestsGeneralUid: string;
	uid: string;
	value: string;
}
export interface IRequest {
	PaymentForm: IPaymentForm;
	uid: string;
	Apportionments: IApportionment[];
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
	cardHolder: ICardHolder;
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
	payload: IRequest[];
}

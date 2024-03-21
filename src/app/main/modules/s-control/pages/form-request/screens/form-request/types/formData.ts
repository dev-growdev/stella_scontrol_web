interface Payments {
	value: string;
	dueDate: Date | null;
}

interface Apportionments {
	costCenter: string;
	accountingAccount: string;
	value: string;
}

interface CardHolderToForm {
	uid: string;
	name: string;
}

export interface FormDataType {
	paymentMethod: string;
	cardHolder?: CardHolderToForm;
	sendReceipt: boolean;
	isRateable: boolean;
	products: { product: string }[];
	description?: string;
	supplier: string;
	payments: Payments[];
	typeAccount?: string;
	uploadedFiles: File[];
	accountingAccount: string;
	apportionments?: Apportionments[];
	pix?: string;
	bankTransfer?: {
		bank: string;
		accountNumber: string;
		agency: string;
		accountType: string;
		cpfOrCnpj: string;
	};
}

import { IRequest } from '../../../types/request';

export function mapToFormDTO(request: IRequest) {
	const {
		PaymentForm,
		sendReceipt,
		isRateable,
		Products,
		cardHolder,
		unregisteredProducts,
		description,
		supplier,
		payments,
		accountingAccount,
		Apportionments,
		bankTransfer,
		pix,
		files
	} = request;

	return {
		paymentMethod: { name: PaymentForm.name, uid: PaymentForm.uid },
		valueProducts: null,
		bankTransfer: bankTransfer || null,
		sendReceipt,
		isRateable,
		pix,
		cardHolder: { uid: cardHolder?.uid, name: cardHolder?.name, code: cardHolder?.code },
		products: [...Products, ...unregisteredProducts],
		description,
		supplier,
		payments: payments.map(payment => ({ value: `${payment.value}`, dueDate: new Date(payment.dueDate) })),
		getFiles: files,
		uploadedFiles: [],
		accountingAccount,
		apportionments: Apportionments
	};
}

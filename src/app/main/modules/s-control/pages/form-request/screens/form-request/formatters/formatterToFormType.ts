import { IRequestType } from '../../../types/request';
import { TPaymentRequestForm } from '../validations/paymentRequestForm.schema';

export function mapToFormDTO(request: IRequestType): Promise<TPaymentRequestForm> {
	console.log(request, 'request');
	const {
		PaymentForm,
		sendReceipt,
		isRateable,
		Products,
		CardHolder,
		unregisteredProducts,
		description,
		supplier,
		payments,
		accountingAccount,
		Apportionments,
		bankTransfer
	} = request;

	return {
		paymentMethod: { name: PaymentForm.name, uid: PaymentForm.uid },
		valueProducts: null,
		bankTransfer: bankTransfer ? JSON.parse(bankTransfer) : null,
		sendReceipt,
		isRateable,
		cardHolder: { uid: CardHolder.uid, name: CardHolder.name, code: CardHolder.code },
		products: [...Products, ...unregisteredProducts],
		description,
		supplier,
		payments: payments.map(payment => ({ value: `${payment.value}`, dueDate: new Date(payment.dueDate) })),
		uploadedFiles: [],
		accountingAccount,
		apportionments: Apportionments
	};
}

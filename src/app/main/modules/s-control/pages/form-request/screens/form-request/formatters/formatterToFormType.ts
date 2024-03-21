import { IRequestType } from '../../../types/request';
import { TPaymentRequestForm } from '../validations/paymentRequestForm.schema';

export function mapToFormDTO(request: IRequestType): Promise<TPaymentRequestForm> {
	console.log(request, '-----------');
	const {
		PaymentForm,
		sendReceipt,
		isRateable,
		Products,
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
		products: [...Products, ...unregisteredProducts],
		description,
		supplier,
		payments: payments.map(payment => ({ value: `${payment.value}`, dueDate: new Date(payment.dueDate) })),
		uploadedFiles: [],
		accountingAccount,
		apportionments: Apportionments
	};
}

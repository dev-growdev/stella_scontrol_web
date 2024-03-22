import { IRequestType } from '../../../types/request';
import { TPaymentRequestForm } from '../validations/paymentRequestForm.schema';

export function mapToFormDTO(request: IRequestType): Promise<TPaymentRequestForm> {
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
		bankTransfer,
		pix,
		files
	} = request;

	return {
		paymentMethod: { name: PaymentForm.name, uid: PaymentForm.uid },
		valueProducts: null,
		bankTransfer: bankTransfer ? JSON.parse(bankTransfer) : null,
		getFiles: files,
		sendReceipt,
		isRateable,
		pix,
		cardHolder: { uid: CardHolder?.uid, name: CardHolder?.name, code: CardHolder?.code },
		products: [...Products, ...unregisteredProducts],
		description,
		supplier,
		payments: payments.map(payment => ({ value: `${payment.value}`, dueDate: new Date(payment.dueDate) })),
		uploadedFiles: [],
		accountingAccount,
		apportionments: Apportionments
	};
}

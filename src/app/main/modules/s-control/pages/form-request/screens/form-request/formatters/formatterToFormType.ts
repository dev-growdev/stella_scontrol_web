import { IBankTransfer, IRequestPaymentGeneral } from '../../../types/request';

export function formatterToFormType(request: IRequestPaymentGeneral) {
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
		bankTransfer: bankTransfer ? (JSON.parse(bankTransfer as string) as IBankTransfer) : null,
		getFiles: files,
		sendReceipt,
		isRateable,
		pix,
		cardHolder: cardHolder
			? { uid: cardHolder?.uid, name: cardHolder?.name, code: cardHolder?.code }
			: {
					name: '',
					code: ''
			  },
		products: [...Products, ...unregisteredProducts],
		description,
		supplier,
		payments: payments.map(payment => ({
			value: `${payment.value}`,
			dueDate: new Date(payment.dueDate),
			uid: payment.uid
		})),
		uploadedFiles: [],
		accountingAccount,
		apportionments: Apportionments
	};
}

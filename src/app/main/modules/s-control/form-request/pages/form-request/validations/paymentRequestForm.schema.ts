import { array, boolean, date, object, string } from 'yup';

export const paymentRequestFormSchema = object().shape({
	paymentMethod: string().required('É necessário adicionar uma forma de pagamento.'),
	requiredReceipt: boolean(),
	isRateable: boolean().required(),
	cardHolder: object().when('paymentMethod', (paymentMethod: string[], schema) => {
		return paymentMethod[0].includes('Cartão')
			? schema.shape({
					uid: string().required(),
					name: string().required('É necessário adicionar um portador.')
			  })
			: schema;
	}),
	bankTransfer: object().when('paymentMethod', (paymentMethod, schema) => {
		return paymentMethod[0] === 'Transferência bancária'
			? schema.shape({
					bank: string().required('É necessário adicionar um banco'),
					accountNumber: string().required('É necessário adicionar um número de conta'),
					agency: string().required('É necessário adicionar uma agência'),
					accountType: string().required('É necessário adicionar um tipo de conta.'),
					cpfOrCnpj: string().required('É necessário adicionar um CPF ou CNPJ.')
			  })
			: schema;
	}),
	pix: string().when('paymentMethod', (paymentMethod, schema) => {
		return paymentMethod[0] === 'Pix' ? schema.required('É necessário adicionar um Pix.') : schema;
	}),
	products: array()
		.of(
			object()
				.shape({
					product: string().required()
				})
				.required('É necessário adicionar um produto.')
		)
		.min(1, 'É necessário adicionar um produto.'),
	description: string(),
	supplier: string().required('É necessário adicionar um fornecedor.'),
	payments: array()
		.of(
			object().shape({
				value: string().required('É necessário um valor.'),
				dueDate: date().nullable().required('É necessário adicionar uma data de vencimento.')
			})
		)
		.required(),
	typeAccount: string(),
	uploadedFiles: array(),
	accountingAccount: string(),
	apportionments: array()
		.of(
			object().shape({
				costCenter: string().required('É necessário adicionar Centro de Custo.'),
				accountingAccount: string().required('É necessário adicionar Conta Contábil'),

				value: string().required()
			})
		)
		.notRequired()
});

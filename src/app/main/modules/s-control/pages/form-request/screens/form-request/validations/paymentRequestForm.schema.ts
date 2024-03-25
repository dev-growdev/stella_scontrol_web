import * as z from 'zod';

const paymentRequestFormSchema = z
	.object({
		paymentMethod: z.object({
			name: z.string({
				required_error: 'É necessário adicionar uma forma de pagamento.'
			}),
			uid: z.string({
				required_error: 'É necessário adicionar uma forma de pagamento.'
			})
		}),
		valueProducts: z.string().nullable().optional(),
		sendReceipt: z.boolean(),
		isRateable: z.boolean(),
		cardHolder: z
			.object({
				uid: z.string().uuid(),
				name: z.string().min(1, 'É necessário adicionar um portador.')
			})
			.optional(),
		bankTransfer: z
			.object({
				bank: z.string().min(2, 'É necessário adicionar um banco'),
				accountNumber: z.string().min(2, 'É necessário adicionar um número de conta'),
				agency: z.string().min(2, 'É necessário adicionar uma agência'),
				accountType: z
					.string({
						required_error: 'É necessário adicionar um tipo de conta.'
					})
					.min(2, 'É necessário adicionar um tipo de conta.'),
				cpfOrCnpj: z.string().min(11, 'É necessário adicionar um CPF ou CNPJ.')
			})
			.optional(),
		pix: z.string().optional(),

		products: z.array(
			z.object({
				name: z.string({
					required_error: 'É necessário adicionar um produto.'
				}),
				uid: z.string().optional()
			})
		),
		description: z.string(),
		supplier: z.string().min(5, 'É necessário adicionar um fornecedor.'),
		payments: z.array(
			z.object({
				value: z.string().min(1, 'É necessário um valor.'),
				dueDate: z.date({
					required_error: 'É necessário adicionar uma data.',
					invalid_type_error: 'É necessário adicionar uma data de vencimento.'
				})
			})
		),
		uploadedFiles: z.array(z.instanceof(File)),
		getFiles: z.array(z.object({ name: z.string(), key: z.string(), uid: z.string() })).optional(),
		accountingAccount: z.string().optional(),
		apportionments: z
			.array(
				z.object({
					costCenter: z
						.string({
							required_error: 'É necessário adicionar Centro de Custo.'
						})
						.min(5, 'É necessário adicionar Centro de Custo.'),
					accountingAccount: z
						.string({
							required_error: 'É necessário adicionar Conta Contábil'
						})
						.min(5, 'É necessário adicionar Conta Contábil'),
					value: z
						.string({
							required_error: 'É necessário um valor.',
							invalid_type_error: 'É necessário adicionar uma string.'
						})
						.min(1, 'É necessário adicionar um valor.')
				})
			)
			.optional()
	})
	.superRefine((value, ctx) => {
		if (value.paymentMethod.name === 'Pix' && value.pix === '') {
			ctx.addIssue({
				path: ['pix'],
				message: 'É necessário adicionar uma chave pix.',
				code: z.ZodIssueCode.custom
			});
		}
		if (value.paymentMethod.name.includes('Cartão') && !value.cardHolder) {
			ctx.addIssue({
				path: ['cardHolder'],
				message: 'É necessário adicionar um portador.',
				code: z.ZodIssueCode.custom
			});
		}
		if (!value.isRateable && value.accountingAccount === '') {
			ctx.addIssue({
				path: ['accountingAccount'],
				message: 'É necessário adicionar uma conta contábil.',
				code: z.ZodIssueCode.custom
			});
		}
		if (value.products.length === 0 && value.supplier) {
			ctx.addIssue({
				path: ['products'],
				message: 'É necessário adicionar ao menos um produto.',
				code: z.ZodIssueCode.custom
			});
		}
		if (value.apportionments.length === 0 && value.isRateable) {
			ctx.addIssue({
				path: ['apportionments'],
				message: 'É necessário adicionar rateio.',
				code: z.ZodIssueCode.custom
			});
		}
	});

export type TPaymentRequestForm = z.infer<typeof paymentRequestFormSchema>;

export { paymentRequestFormSchema };

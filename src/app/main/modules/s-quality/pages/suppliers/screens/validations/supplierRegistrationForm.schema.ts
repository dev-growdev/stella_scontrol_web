import * as z from 'zod';

const ContinentEnum = z.enum(['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']);
// verificar validação correta
const phoneRegex = /^([+]?[\s0-9]+)?([(]?\d{3,}[)])?([-]?[\s]?[0-9]){8,}$/;
type ContinentEnum = z.infer<typeof ContinentEnum>;

const supplierRegistrationFormSchema = z.object({
  name: z
    .string({
      required_error: 'It is necessary to add the name of the supplier.'
    })
    .trim()
    .min(3, 'It is necessary to add the name of the supplier.'),
  email: z.string({ required_error: 'You need to add email.' }).email({ message: 'You need to add email.' }),
  continent: ContinentEnum,
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine(phone => (!phone ? true : phoneRegex.test(phone)), 'Phone is invalid.'),
  contactName: z.string().optional(),
  enable: z.enum(['true', 'false'])
});

export type TSupplierRegistrationForm = z.input<typeof supplierRegistrationFormSchema>;

export { supplierRegistrationFormSchema };

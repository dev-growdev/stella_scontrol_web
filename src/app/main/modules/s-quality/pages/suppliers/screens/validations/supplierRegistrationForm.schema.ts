import * as z from 'zod';

const ContinentEnum = z.enum(['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']);
const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );
type ContinentEnum = z.infer<typeof ContinentEnum>;

const supplierRegistrationFormSchema = z.object({
    name: z
        .string({
        required_error: "It is necessary to add the name of the supplier."
        })
        .trim()
        .min(3, "It is necessary to add the name of the supplier."),
    email: z.string({required_error: "You need to add email."}).email({message: "You need to add email." }),
    continent: ContinentEnum,
    address: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().regex(phoneRegex, 'Invalid Number!').optional(),
    contactName: z.string().optional(),
});

export type TSupplierRegistrationForm = z.infer<typeof supplierRegistrationFormSchema>;

export { supplierRegistrationFormSchema };
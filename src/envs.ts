import { z } from 'zod';

const envSchema = z.object({
	REACT_APP_CLIENT_ID: z.string()
});

export const env = envSchema.parse(process.env);

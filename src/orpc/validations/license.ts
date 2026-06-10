import { z } from 'zod';

export const verifyLicenseValidation = z.object({
	key: z.string().min(1),
	domain: z.string().min(1),
});

export const checkLicenseValidation = z.object({
	key: z.string().min(1),
});

export type VerifyLicenseInput = z.infer<typeof verifyLicenseValidation>;
export type CheckLicenseInput = z.infer<typeof checkLicenseValidation>;

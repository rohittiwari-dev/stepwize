import { z } from 'zod';

export const changePlanValidation = z.object({
	planId: z.cuid(),
});

export type ChangePlanInput = z.infer<typeof changePlanValidation>;

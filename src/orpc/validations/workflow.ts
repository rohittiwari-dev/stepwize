import { z } from 'zod';

export const getWorkflowsValidation = z.object({
	search_query: z.string().trim().optional(),
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().optional().default(10),
	sort_by: z.enum(['asc', 'desc']).optional().default('desc'),
	sort_key: z
		.enum(['id', 'name', 'createdAt'])
		.optional()
		.default('createdAt'),
});

export const getWorkflowsContext = getWorkflowsValidation.extend({
	userId: z.cuid2(),
});

export type GetWorkflowsContext = z.infer<typeof getWorkflowsContext>;

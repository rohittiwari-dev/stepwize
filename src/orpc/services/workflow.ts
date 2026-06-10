import prisma from '@/lib/db';
import { GetWorkflowsContext } from '../validations/workflow';

const WorkflowService = {
	async getWorkflows(ctx: GetWorkflowsContext) {
		const workflows = await prisma.workflow.findMany({
			where: {
				userId: ctx.userId,
			},
			skip: (ctx.page - 1) * ctx.limit,
			take: ctx.limit,
			orderBy: {
				[ctx.sort_key]: ctx.sort_by,
			},
		});
		const total = await prisma.workflow.count({
			where: {
				userId: ctx.userId,
			},
		});

		return {
			totalDocs: total,
			hasNextPage: ctx.page * ctx.limit < total,
			hasPrevPage: ctx.page > 1,
			totalPages: Math.ceil(total / ctx.limit),
			workflows,
			docsPerPage: ctx.limit,
			currentPage: ctx.page,
		};
	},
};

export default WorkflowService;

import { protectedProcedure } from '../procedures';
import WorkflowService from '../services/workflow';
import { getWorkflowsValidation } from '../validations/workflow';

export const workflowRouter = {
	getWorkflows: protectedProcedure
		.input(getWorkflowsValidation)
		.handler(async ({ input, context }) => {
			const data = await WorkflowService.getWorkflows({
				...input,
				userId: context.user.id,
			});
			return data;
		}),
};

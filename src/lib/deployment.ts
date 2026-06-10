export const DEPLOYMENT_MODE = (process.env.DEPLOYMENT_MODE ?? 'selfhost') as
	| 'saas'
	| 'selfhost';
export const isSelfHosted = DEPLOYMENT_MODE === 'selfhost';

import { prisma } from '../src/lib/db';
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
	server: 'sandbox',
});

type PlanSeed = {
	name: string;
	description: string;
	checkoutDescription: string;
	price: number;
	currency: string;
	interval: string | null;
	polarBillingType: 'recurring' | 'one_time' | 'free';
	maxWorkflows: number;
	maxExecutionHours: number;
	historyDays: number;
	maxCredentials: number;
	templateCategory: string;
	maxTeamMembers: number;
	maxTeams: number;
	features: string[];
};

const plans: PlanSeed[] = [
	{
		name: 'Free',
		description: 'Get started with basic automation',
		checkoutDescription:
			'Start automating your spreadsheet workflows for free. Includes 1 workflow, 10 hours of execution time, and access to 10 starter templates. Perfect for trying out Stepwize.',
		price: 0,
		currency: 'usd',
		interval: null,
		polarBillingType: 'free',
		maxWorkflows: 1,
		maxExecutionHours: 10,
		historyDays: 7,
		maxCredentials: 2,
		templateCategory: 'FREE',
		maxTeamMembers: 3,
		maxTeams: 1,
		features: [
			'1 workflow',
			'10 hrs/sheet execution time',
			'7 days history',
			'2 credentials',
			'10 free templates',
			'3 team members',
			'1 team',
		],
	},
	{
		name: 'Basic',
		description: 'For growing teams and workflows',
		checkoutDescription:
			'Unlock 15 workflows with unlimited execution time. Ideal for growing teams that need more automation power, 30 starter templates, and up to 10 team members across 3 teams.',
		price: 1000,
		currency: 'usd',
		interval: 'month',
		polarBillingType: 'recurring',
		maxWorkflows: 15,
		maxExecutionHours: -1,
		historyDays: 10,
		maxCredentials: 15,
		templateCategory: 'BASIC',
		maxTeamMembers: 10,
		maxTeams: 3,
		features: [
			'15 workflows',
			'Unlimited execution time',
			'10 days history',
			'15 credentials',
			'30 starter templates',
			'10 team members',
			'3 teams',
		],
	},
	{
		name: 'Pro',
		description: 'For power users and scaling teams',
		checkoutDescription:
			'Unlimited workflows, unlimited execution, and unlimited credentials. Built for power users and scaling teams with 60-day history, 50 pro templates, and up to 30 team members.',
		price: 1900,
		currency: 'usd',
		interval: 'month',
		polarBillingType: 'recurring',
		maxWorkflows: -1,
		maxExecutionHours: -1,
		historyDays: 60,
		maxCredentials: -1,
		templateCategory: 'PRO',
		maxTeamMembers: 30,
		maxTeams: 5,
		features: [
			'Unlimited workflows',
			'Unlimited execution time',
			'60 days history',
			'Unlimited credentials',
			'50 pro templates',
			'30 team members',
			'5 teams',
		],
	},
	{
		name: 'Enterprise',
		description: 'Custom solutions for large organizations',
		checkoutDescription:
			'Everything in Pro plus unlimited history, unlimited teams and members, all templates, priority support, custom integrations, and SLA. Contact us to get started.',
		price: 0,
		currency: 'usd',
		interval: null,
		polarBillingType: 'free',
		maxWorkflows: -1,
		maxExecutionHours: -1,
		historyDays: -1,
		maxCredentials: -1,
		templateCategory: 'ALL',
		maxTeamMembers: -1,
		maxTeams: -1,
		features: [
			'Everything in Pro',
			'Unlimited history',
			'Unlimited team members',
			'Unlimited teams',
			'All templates',
			'Priority support',
			'Custom integrations',
			'SLA',
		],
	},
	{
		name: 'Self Host',
		description: 'Run Stepwize on your own infrastructure',
		checkoutDescription:
			'One-time purchase to run Stepwize on your own infrastructure. Includes everything in Enterprise, full data ownership, a self-host license key, and lifetime access.',
		price: 3500,
		currency: 'usd',
		interval: null,
		polarBillingType: 'one_time',
		maxWorkflows: -1,
		maxExecutionHours: -1,
		historyDays: -1,
		maxCredentials: -1,
		templateCategory: 'ALL',
		maxTeamMembers: -1,
		maxTeams: -1,
		features: [
			'Everything in Enterprise',
			'Self-hosted deployment',
			'Full data ownership',
			'One-time license fee',
		],
	},
];

function buildPrices(plan: PlanSeed) {
	if (plan.polarBillingType === 'free') {
		return [{ amountType: 'free' as const }];
	}
	return [
		{
			amountType: 'fixed' as const,
			priceAmount: plan.price,
		},
	];
}

function buildMetadata(plan: PlanSeed) {
	return {
		planName: plan.name,
		billingType: plan.polarBillingType,
		priceUsdCents: plan.price,
		maxWorkflows: plan.maxWorkflows,
		maxExecutionHours: plan.maxExecutionHours,
		historyDays: plan.historyDays,
		maxCredentials: plan.maxCredentials,
		templateCategory: plan.templateCategory,
		maxTeamMembers: plan.maxTeamMembers,
		maxTeams: plan.maxTeams,
	};
}

let benefitsCache: Map<string, string> | null = null;

async function loadBenefitsCache() {
	if (benefitsCache) return benefitsCache;
	benefitsCache = new Map();
	const existing = await polar.benefits.list({});
	for await (const page of existing) {
		for (const b of page.result.items) {
			benefitsCache.set(b.description, b.id);
			if (b.type === 'license_keys') {
				benefitsCache.set('__license_keys__', b.id);
			}
		}
	}
	return benefitsCache;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function findOrCreateBenefit(description: string): Promise<string> {
	const cache = await loadBenefitsCache();
	const cached = cache.get(description);
	if (cached) return cached;

	await delay(300);
	const benefit = await polar.benefits.create({
		type: 'custom',
		description,
		properties: {},
	});
	cache.set(description, benefit.id);
	console.log(`    Created benefit: ${description}`);
	return benefit.id;
}

async function findOrCreateLicenseKeyBenefit(): Promise<string> {
	const cache = await loadBenefitsCache();
	const cached = cache.get('__license_keys__');
	if (cached) return cached;

	await delay(300);
	const benefit = await polar.benefits.create({
		type: 'license_keys',
		description: 'Self-host license key',
		properties: {
			prefix: 'SW',
			activations: { limit: 1, enableCustomerAdmin: true },
		},
	});
	cache.set('__license_keys__', benefit.id);
	console.log(`    Created license key benefit`);
	return benefit.id;
}

async function syncPolarProduct(plan: PlanSeed): Promise<string | null> {
	const prices = buildPrices(plan);
	const metadata = buildMetadata(plan);

	let productId: string | null = null;

	const existing = await polar.products.list({ query: plan.name });
	for await (const page of existing) {
		const match = page.result.items.find((p) => p.name === plan.name);
		if (match) {
			await polar.products.update({
				id: match.id,
				productUpdate: {
					name: plan.name,
					description: plan.checkoutDescription,
					metadata,
					prices,
				},
			});
			console.log(`  Updated Polar product: ${match.name} (${match.id})`);
			productId = match.id;
			break;
		}
	}

	if (!productId) {
		if (plan.polarBillingType === 'recurring') {
			const product = await polar.products.create({
				name: plan.name,
				description: plan.checkoutDescription,
				metadata,
				recurringInterval: 'month',
				prices,
			});
			console.log(`  Created Polar product: ${product.name} (${product.id})`);
			productId = product.id;
		} else {
			const product = await polar.products.create({
				name: plan.name,
				description: plan.checkoutDescription,
				metadata,
				prices,
			});
			console.log(`  Created Polar product: ${product.name} (${product.id})`);
			productId = product.id;
		}
	}

	console.log(`  Syncing benefits...`);
	const benefitIds: string[] = [];

	for (const feature of plan.features) {
		const id = await findOrCreateBenefit(feature);
		benefitIds.push(id);
	}

	if (plan.name === 'Self Host') {
		const licenseId = await findOrCreateLicenseKeyBenefit();
		benefitIds.push(licenseId);
	}

	await polar.products.updateBenefits({
		id: productId,
		productBenefitsUpdate: { benefits: benefitIds },
	});
	console.log(`  Attached ${benefitIds.length} benefits`);

	return productId;
}

async function main() {
	console.log('Seeding subscription plans...\n');

	for (const plan of plans) {
		console.log(`Processing: ${plan.name}`);

		const polarProductId = await syncPolarProduct(plan);

		const { features, polarBillingType, checkoutDescription, ...planData } = plan;

		await prisma.subscriptionPlan.upsert({
			where: { name: planData.name },
			update: {
				...planData,
				polarProductId,
				features: {
					deleteMany: {},
					create: features.map((name) => ({ name })),
				},
			},
			create: {
				...planData,
				polarProductId,
				features: {
					create: features.map((name) => ({ name })),
				},
			},
		});

		console.log(`  DB plan upserted: ${plan.name}\n`);
	}

	console.log('Done!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());

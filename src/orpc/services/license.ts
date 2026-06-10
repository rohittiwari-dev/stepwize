import prisma from '@/lib/db';
import { generateLicenseKey, isValidLicenseFormat } from '@/features/license/utils/keygen';

const LicenseService = {
	async createLicense(email: string, orderId: string) {
		const key = generateLicenseKey();

		return prisma.licenseKey.create({
			data: {
				key,
				email,
				orderId,
			},
		});
	},

	async verifyAndActivate(key: string, domain: string) {
		if (!isValidLicenseFormat(key)) {
			return { valid: false, reason: 'Invalid license format' };
		}

		const license = await prisma.licenseKey.findUnique({
			where: { key },
		});

		if (!license) {
			return { valid: false, reason: 'License not found' };
		}

		if (license.expiresAt && license.expiresAt < new Date()) {
			return { valid: false, reason: 'License expired' };
		}

		if (license.activated && license.domain !== domain) {
			return { valid: false, reason: 'License already activated on a different domain' };
		}

		if (!license.activated) {
			await prisma.licenseKey.update({
				where: { key },
				data: {
					activated: true,
					activatedAt: new Date(),
					domain,
				},
			});
		}

		return { valid: true, reason: null };
	},

	async verify(key: string) {
		if (!isValidLicenseFormat(key)) {
			return { valid: false, reason: 'Invalid license format' };
		}

		const license = await prisma.licenseKey.findUnique({
			where: { key },
		});

		if (!license) {
			return { valid: false, reason: 'License not found' };
		}

		if (license.expiresAt && license.expiresAt < new Date()) {
			return { valid: false, reason: 'License expired' };
		}

		return { valid: true, activated: license.activated, domain: license.domain };
	},

	async getLicensesByEmail(email: string) {
		return prisma.licenseKey.findMany({
			where: { email },
			orderBy: { createdAt: 'desc' },
		});
	},

	async deactivate(key: string) {
		return prisma.licenseKey.update({
			where: { key },
			data: {
				activated: false,
				activatedAt: null,
				domain: null,
			},
		});
	},
};

export default LicenseService;

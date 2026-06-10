import { publicProcedure, protectedProcedure } from '../procedures';
import { verifyLicenseValidation, checkLicenseValidation } from '../validations/license';
import LicenseService from '../services/license';

export const licenseRouter = {
	verify: publicProcedure
		.input(verifyLicenseValidation)
		.handler(async ({ input }) => {
			return LicenseService.verifyAndActivate(input.key, input.domain);
		}),

	check: publicProcedure
		.input(checkLicenseValidation)
		.handler(async ({ input }) => {
			return LicenseService.verify(input.key);
		}),

	myLicenses: protectedProcedure.handler(
		async ({ context: { user } }) => {
			return LicenseService.getLicensesByEmail(user.email);
		},
	),
};

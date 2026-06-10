import { randomBytes, createHmac } from 'crypto';

const LICENSE_PREFIX = 'SW';
const SEGMENT_LENGTH = 5;
const SEGMENT_COUNT = 5;
const HMAC_SECRET = process.env.LICENSE_HMAC_SECRET || process.env.BETTER_AUTH_SECRET!;

function generateRawKey(): string {
	const bytes = randomBytes(20);
	const encoded = bytes.toString('base32' as any) || bytes.toString('hex').toUpperCase();

	const segments: string[] = [];
	for (let i = 0; i < SEGMENT_COUNT; i++) {
		segments.push(encoded.substring(i * SEGMENT_LENGTH, (i + 1) * SEGMENT_LENGTH));
	}

	return `${LICENSE_PREFIX}-${segments.join('-')}`;
}

function computeChecksum(key: string): string {
	return createHmac('sha256', HMAC_SECRET).update(key).digest('hex').substring(0, 8);
}

export function generateLicenseKey(): string {
	const raw = generateRawKey();
	const checksum = computeChecksum(raw);
	return `${raw}-${checksum.toUpperCase()}`;
}

export function isValidLicenseFormat(key: string): boolean {
	const parts = key.split('-');
	if (parts.length !== SEGMENT_COUNT + 2) return false;
	if (parts[0] !== LICENSE_PREFIX) return false;

	const rawKey = parts.slice(0, -1).join('-');
	const providedChecksum = parts[parts.length - 1];
	const expectedChecksum = computeChecksum(rawKey).toUpperCase();

	return providedChecksum === expectedChecksum;
}

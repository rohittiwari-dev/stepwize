/**
 * Shared, type-safe error catalog applied to every procedure via `base.errors()`.
 *
 * Throwing one of these (either `throw errors.NOT_FOUND()` inside a handler, or
 * `throw new ORPCError('NOT_FOUND')`) produces a typed error the client can
 * narrow on. Add a `data` schema (zod/valibot/etc.) to a key if you want typed
 * error payloads — no validation library is wired up yet, so messages only.
 */
export const errors = {
	UNAUTHORIZED: {
		message: 'You must be signed in to do that.',
	},
	FORBIDDEN: {
		message: 'You do not have permission to do that.',
	},
	NOT_FOUND: {
		message: 'The requested resource was not found.',
	},
	CONFLICT: {
		message: 'The resource already exists.',
	},
};

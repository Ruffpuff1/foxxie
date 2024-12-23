import { Identifiers } from '@sapphire/framework';
import { Result } from '@sapphire/result';

interface ResolvedStringOptions {
	maxiumum?: number;
	minimum?: number;
}

export function resolveString(parameter: string, options?: ResolvedStringOptions) {
	if (typeof options?.minimum === 'number' && parameter.length < options.minimum) {
		return Result.err(Identifiers.ArgumentStringTooShort);
	}

	if (typeof options?.maxiumum === 'number' && parameter.length > options.maxiumum) {
		return Result.err(Identifiers.ArgumentStringTooLong);
	}

	return Result.ok(parameter);
}

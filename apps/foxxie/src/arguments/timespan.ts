import { seconds } from '@ruffpuff/utilities';
import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';
import { Duration } from '@sapphire/time-utilities';
import { LanguageKeys } from '#lib/i18n';

export class UserArgument extends Argument<number> {
	public run(parameter: string, context: ArgumentContext): ArgumentResult<number> {
		const duration = this.parseParameter(parameter);

		if (!Number.isSafeInteger(duration)) {
			return this.error({
				context,
				identifier: LanguageKeys.Arguments.Duration,
				parameter
			});
		}

		if (typeof context.minimum === 'number' && duration < context.minimum) {
			return this.error({
				context: { ...context, remaining: context.minimum },
				identifier: LanguageKeys.Arguments.TimespanTooSmall,
				parameter
			});
		}

		if (typeof context.maximum === 'number' && duration > context.maximum) {
			return this.error({
				context: { ...context, remaining: context.maximum },
				identifier: LanguageKeys.Arguments.TimespanTooLarge,
				parameter
			});
		}

		return this.ok(duration);
	}

	private parseParameter(parameter: string): number {
		const number = Number(parameter);
		if (!Number.isNaN(number)) return seconds(number);

		const duration = new Duration(parameter).offset;
		if (!Number.isNaN(duration)) return duration;

		const date = Date.parse(parameter);
		if (!Number.isNaN(date)) return date - Date.now();

		return NaN;
	}
}

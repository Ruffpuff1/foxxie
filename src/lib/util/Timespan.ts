import { LanguageKeys } from '#lib/i18n';
import { getFixedT, TFunction } from 'i18next';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Timespan {
	public static FromMilliseconds(ms: number): TimespanData {
		if (ms < Timespan.Seconds()) {
			return new TimespanData(ms);
		}

		if (ms < Timespan.Minutes()) {
			const seconds = Math.floor(ms / Timespan.Seconds());
			const remainingMs = ms % Timespan.Seconds();

			return new TimespanData(remainingMs, seconds);
		}

		if (ms < Timespan.Hours()) {
			const minutes = Math.floor(ms / Timespan.Minutes());
			const remainder = Timespan.FromMilliseconds(ms % Timespan.Minutes());

			return new TimespanData(remainder.milliseconds, remainder.seconds, minutes);
		}

		if (ms < Timespan.Days()) {
			const hours = Math.floor(ms / Timespan.Hours());
			const remainder = Timespan.FromMilliseconds(ms % Timespan.Hours());

			return new TimespanData(remainder.milliseconds, remainder.seconds, remainder.minutes, hours);
		}

		if (ms < Timespan.Weeks()) {
			const days = Math.floor(ms / Timespan.Days());
			const remainder = Timespan.FromMilliseconds(ms % Timespan.Days());

			return new TimespanData(remainder.milliseconds, remainder.seconds, remainder.minutes, remainder.hours, days);
		}

		if (ms < Timespan.Months()) {
			const weeks = Math.floor(ms / Timespan.Weeks());
			const remainder = Timespan.FromMilliseconds(ms % Timespan.Weeks());

			return new TimespanData(remainder.milliseconds, remainder.seconds, remainder.minutes, remainder.hours, remainder.days, weeks);
		}

		if (ms < Timespan.Years()) {
			const months = Math.floor(ms / Timespan.Months());
			const remainder = Timespan.FromMilliseconds(ms % Timespan.Months());

			return new TimespanData(
				remainder.milliseconds,
				remainder.seconds,
				remainder.minutes,
				remainder.hours,
				remainder.days,
				remainder.weeks,
				months
			);
		}

		const years = Math.floor(ms / Timespan.Years());
		const remainder = Timespan.FromMilliseconds(ms % Timespan.Years());

		return new TimespanData(
			remainder.milliseconds,
			remainder.seconds,
			remainder.minutes,
			remainder.hours,
			remainder.days,
			remainder.weeks,
			remainder.months,
			years
		);
	}

	public static Seconds(seconds?: number) {
		if (!seconds) return 1000;
		return seconds * 1000;
	}

	public static Minutes(minutes?: number) {
		if (!minutes) return 60000;
		return minutes * 60000;
	}

	public static Hours(hours?: number) {
		if (!hours) return 3600000;
		return hours * 3600000;
	}

	public static Days(days?: number) {
		if (!days) return 86400000;
		return days * 86400000;
	}

	public static Weeks(weeks?: number) {
		if (!weeks) return Timespan.Days(7);
		return Timespan.Days(7) * weeks;
	}

	public static Months(months?: number) {
		if (!months) return Timespan.Weeks(4);
		return Timespan.Weeks() * 4 * months;
	}

	public static Years(years?: number) {
		if (!years) return Timespan.Days(365);
		return Timespan.Days(365) * years;
	}
}

export class TimespanData {
	public constructor(
		public milliseconds: number = 0,
		public seconds: number = 0,
		public minutes: number = 0,
		public hours: number = 0,
		public days: number = 0,
		public weeks: number = 0,
		public months: number = 0,
		public years: number = 0
	) {}

	public format(options: TimespanFormatOptions = new TimespanFormatOptions()) {
		const output = this.toArray(options);

		return options.useAnd
			? options.t(LanguageKeys.Globals.And, { value: output.reverse().slice(0, options.depth) })
			: output.reverse().slice(0, options.depth).join(', ');
	}

	public formatShort() {
		let seconds = '00';
		let minutes = '00';
		let hours = '';

		if (this.seconds) {
			if (this.seconds < 10) {
				seconds = `0${this.seconds}`;
			} else {
				seconds = `${this.seconds}`;
			}
		}

		if (this.minutes) {
			minutes = `${this.minutes}`;
		}

		if (this.hours) {
			hours = `${this.hours}`;
		}

		let output = '';

		if (hours) output += `${hours}:`;
		output += `${minutes}:${seconds}`;

		return output;
	}

	public toArray(options: TimespanFormatOptions = new TimespanFormatOptions()) {
		const output = [];

		if (this.milliseconds && options.milliseconds) {
			output.push(options.t(LanguageKeys.Globals.Milliseconds, { count: this.milliseconds }));
		}

		if (this.seconds && options.seconds) {
			output.push(options.t(LanguageKeys.Globals.Seconds, { count: this.seconds }));
		}

		if (this.minutes && options.minutes) {
			output.push(options.t(LanguageKeys.Globals.Minutes, { count: this.minutes }));
		}

		if (this.hours && options.hours) {
			output.push(`${this.hours} hours`);
		}

		if (this.days && options.days) {
			output.push(`${this.days} days`);
		}

		if (this.weeks && options.weeks) {
			output.push(`${this.weeks} weeks`);
		}

		if (this.months && options.months) {
			output.push(`${this.months} months`);
		}

		if (this.years && options.years) {
			output.push(`${this.years} years`);
		}

		return output;
	}

	public toString() {
		const output = this.toArray();

		return getFixedT('en-US')(LanguageKeys.Globals.And, { value: output.reverse() });
	}
}

export class TimespanFormatOptions {
	public constructor(
		public t: TFunction = getFixedT('en-US'),
		public depth: number = 2,
		public useAnd: boolean = false,
		public milliseconds: boolean = false,
		public seconds: boolean = true,
		public minutes: boolean = true,
		public hours: boolean = true,
		public days: boolean = true,
		public weeks: boolean = true,
		public months: boolean = true,
		public years: boolean = true
	) {}
}

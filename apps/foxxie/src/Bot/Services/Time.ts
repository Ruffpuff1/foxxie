import { Time as TimeConstants } from '@sapphire/time-utilities';

export class TimeService {
	/**
	 * Converts a number of days to milliseconds.
	 * @param days The amount of days
	 * @returns The amount of milliseconds `days` equals to.
	 */
	public static Days(days: number): number {
		return days * TimeConstants.Day;
	}

	/**
	 * Converts a number of seconds to milliseconds.
	 * @param seconds The amount of seconds
	 * @returns The amount of milliseconds `seconds` equals to.
	 */
	public static Seconds(seconds: number): number {
		return seconds * TimeConstants.Second;
	}
}

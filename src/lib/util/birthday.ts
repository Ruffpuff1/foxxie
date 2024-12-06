import { GuildMember, GuildResolvable } from 'discord.js';
import { container } from '@sapphire/framework';
import { hours } from '#utils/common';
import { fetchTasks } from './util.js';
import { Schedules } from './constants.js';

export interface BirthdayData {
	day: number;
	month: number;
	year: number | null;
}

export const dateFormats = new Map([
	['DD/MM/YYYY', /^(?<day>\d{1,2})\/(?<month>\d{1,2})(?:\/(?<year>\d{4}))?/],
	['DD-MM-YYYY', /^(?<day>\d{1,2})-(?<month>\d{1,2})(?:-(?<year>\d{4}))?/],
	['DD.MM.YYYY', /^(?<day>\d{1,2})\.(?<month>\d{1,2})(?:\.(?<year>\d{4}))?/],
	['MM/DD/YYYY', /^(?<month>\d{1,2})\/(?<day>\d{1,2})(?:\/(?<year>\d{4}))?/],
	['MM-DD-YYYY', /^(?<month>\d{1,2})-(?<day>\d{1,2})(?:-(?<year>\d{4}))?/],
	['MM.DD.YYYY', /^(?<month>\d{1,2})\.(?<day>\d{1,2})(?:\.(?<year>\d{4}))?/],
	['YYYY/MM/DD', /^(?:(?<year>\d{4})\/)?(?<month>\d{1,2})\/(?<day>\d{1,2})/],
	['YYYY-MM-DD', /^(?:(?<year>\d{4})-)?(?<month>\d{1,2})-(?<day>\d{1,2})/],
	['YYYY.MM.DD', /^(?:(?<year>\d{4})\.)?(?<month>\d{1,2})\.(?<day>\d{1,2})/],
	['YYYY/DD/MM', /^(?:(?<year>\d{4})\/)?(?<day>\d{1,2})\/(?<month>\d{1,2})/],
	['YYYY-DD-MM', /^(?:(?<year>\d{4})-)?(?<day>\d{1,2})-(?<month>\d{1,2})/],
	['YYYY.DD.MM', /^(?:(?<year>\d{4})\.)?(?<day>\d{1,2})\.(?<month>\d{1,2})/]
]);

export const enum Month {
	January = 1,
	February,
	March,
	April,
	May,
	June,
	July,
	August,
	September,
	October,
	November,
	December
}

export const getNow = () => Date.now();

export function monthOfYearContainsDay(leap: boolean, month: Month, day: number): boolean {
	if (day < 1) return false;

	switch (month) {
		case Month.February:
			return day <= (leap ? 29 : 28);
		case Month.January:
		case Month.March:
		case Month.May:
		case Month.July:
		case Month.August:
		case Month.October:
		case Month.December:
			return day <= 31;
		default:
			return day <= 30;
	}
}

export function getDateFormat(format: string, language: string): RegExp {
	const value = dateFormats.get(format);

	if (value === undefined) {
		throw new Error(`Could not find language format '${format}' from language '${language}'.`);
	}

	return value;
}

export function getAge(data: BirthdayData, { now = Date.now() } = {}): number | null {
	if (data.year === null) return null;

	const years = new Date(now).getUTCFullYear() - (data.year as number);
	return years;
}

export function compareDate(month: number, day: number, { now = getNow() } = {}): number {
	const date = new Date(now);

	// Compare the month, if it's earlier, pass -1, if it's later, pass 1:
	const dateMonth = date.getUTCMonth() + 1;
	if (month < dateMonth) return -1;
	if (month > dateMonth) return 1;

	// * The month is the same.
	// Compare the day, if it's earlier, pass -1, if it's later, pass 1:
	const dateDay = date.getUTCDate();
	if (day < dateDay) return -1;
	if (day > dateDay) return 1;

	// * The month and day are the same.
	return 0;
}

export function getFormatted({ month, day }: BirthdayData): string {
	const date = nextBirthday(month, day, { timeZoneOffset: 7 });
	return date.toLocaleString();
}

export function yearIsLeap(year: BirthdayData['year']): boolean {
	return ((year as number) % 4 === 0 && (year as number) % 100 !== 0) || (year as number) % 400 === 0;
}

export function getDuration({ month, day }: BirthdayData): string {
	const date = nextBirthday(month, day, { timeZoneOffset: 7 });
	return date.toLocaleString();
}

export function isDST(date: Date) {
	const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
	const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
	return Math.max(jan, jul) !== date.getTimezoneOffset();
}

export function getCaliforniaTimeOffset(date: Date) {
	return isDST(date) ? 7 : 8;
}

export function nextBirthday(
	month: BirthdayData['month'],
	day: BirthdayData['day'],
	{ now = Date.now(), nextYearIfToday = false, timeZoneOffset = 0 } = {}
): Date {
	const yearNow = new Date(now).getUTCFullYear();

	const yearComparisonResult = compareDate(month, day);
	const shouldBeScheduledForNextYear = nextYearIfToday ? yearComparisonResult <= 0 : yearComparisonResult < 0;
	const yearOffset = shouldBeScheduledForNextYear ? 1 : 0;

	const date = Date.UTC(yearNow + yearOffset, month - 1, day);
	timeZoneOffset = getCaliforniaTimeOffset(new Date(date));

	return new Date(date + timeZoneOffset * hours(1));
}

export async function findTasksByMember(resolvable: GuildMember) {
	const userId = resolvable.guild.members.resolveId(resolvable);
	if (!userId) return null;

	const tasks = fetchTasks(Schedules.Birthday);

	return tasks.find((task) => task.data.userId === userId && task.data.guildId === resolvable.guild.id)!;
}

export async function findTasksFromGuild(resolvable: GuildResolvable) {
	const guildId = container.client.guilds.resolveId(resolvable);
	if (!guildId) return [];

	const tasks = await fetchTasks(Schedules.Birthday);

	return tasks.filter((task) => task.data.guildId === guildId);
}

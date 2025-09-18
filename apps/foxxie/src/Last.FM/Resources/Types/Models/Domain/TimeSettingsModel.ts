import { TimePeriod } from '../../Enums/TimePeriod.js';

export interface TimeSettingsModel {
	altDescription?: string;
	apiParameter?: string;
	billboardEndDateTime?: Date;
	billboardStartDateTime?: Date;
	billboardTimeDescription?: string;
	defaultPicked?: boolean;
	description?: string;
	endDateTime?: Date;
	newSearchValue?: string;
	playDays?: number;
	playDaysWithBillboard?: number;
	startDateTime?: Date;
	timeFrom?: number;
	timePeriod?: TimePeriod;
	timeUntil?: number;
	urlParameter?: string;
	useCustomTimePeriod?: boolean;
	usePlays?: boolean;
}

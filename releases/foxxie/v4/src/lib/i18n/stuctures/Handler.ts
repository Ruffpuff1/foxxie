/**
 * Copyright 2019-2021 Antonio Román
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * This version has two new formats added by <@Ruffpuff1> fullDate & shortDate.
 */
import { DurationFormatAssetsTime, DurationFormatter } from '@sapphire/time-utilities';

export abstract class Handler {

    public readonly name: string;
    public readonly number: Intl.NumberFormat;
    public readonly compactNumber: Intl.NumberFormat;
    public readonly and: Intl.ListFormat;
    public readonly listOr: Intl.ListFormat;
    public readonly dateTime: Intl.DateTimeFormat;
    public readonly fullDate: Intl.DateTimeFormat;
    public readonly miniTime: Intl.DateTimeFormat;
    public readonly shortDate: Intl.DateTimeFormat;
    public readonly duration: DurationFormatter;

    public constructor(options: Handler.Options) {
        this.name = options.name;
        this.number = new Intl.NumberFormat(this.name, { maximumFractionDigits: 2 });
        this.compactNumber = new Intl.NumberFormat(this.name, { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2 });
        this.and = new Intl.ListFormat(this.name, { type: 'conjunction' });
        this.listOr = new Intl.ListFormat(this.name, { type: 'disjunction' });
        this.dateTime = new Intl.DateTimeFormat(this.name, { timeZone: 'PST', dateStyle: 'short', timeStyle: 'medium' });
        this.miniTime = new Intl.DateTimeFormat(this.name, { hour: 'numeric', minute: 'numeric', timeZone: 'PST' });
        this.fullDate = new Intl.DateTimeFormat(this.name, { timeZone: 'PST', dateStyle: 'long' });
        this.shortDate = new Intl.DateTimeFormat(this.name, { dateStyle: 'short', timeZone: 'PST' });
        this.duration = new DurationFormatter(options.duration);
    }

    public longDateWithTime(date: Date | number): string {
        return [
            this.fullDate.format(date),
            this.miniTime.format(date)
        ].join(' ');
    }

	public abstract ordinal(cardinal: number): string;

}

export namespace Handler {
	export interface Options {
		name: string;
		duration: DurationFormatAssetsTime;
	}
}
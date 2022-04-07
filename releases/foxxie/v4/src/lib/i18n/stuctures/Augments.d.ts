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
// TODO: Remove this when TS types Intl.ListFormat
declare namespace Intl {

	class ListFormat {

	    public constructor(locales: string | string[], options?: ListFormatOptions);
	    public format(values: Iterable<string>): string;
	    public formatToParts(values: readonly string[]): ListFormatPart[];
	    public static supportedLocalesOf(locales: string | string[], options?: ListFormatOptions): string[];

	}

	interface ListFormatOptions {
		localeMatcher?: 'lookup' | 'best fit';
		type?: 'conjunction' | 'disjunction' | 'unit';
		style?: 'long' | 'short' | 'narrow';
	}

	interface ListFormatPart {
		type: 'element' | 'literal';
		value: string;
	}
}
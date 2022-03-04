/**
 * @license Apache License 2.0
 * @copyright 2019 Skyra Project
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

import type { LocaleString, ParsedContext } from '../types';

export abstract class BaseHandler {
    /**
     * The locale key for this handler.
     * Currently supports `en-US` and `es-MX`.
     */
    public static key: LocaleString;

    /**
     * The map of RegExp patterns for this handler.
     * See {@link PatternsMap} for more information.
     */
    public static patterns: PatternsMap;

    /**
     * The casual parser for this handler.
     * Accepts inputs such as `this morning` and `this afternoon`.
     * Returns a {@link ParsedContext} object.
     * @example
     * ```ts
     * casual('this morning');
     * // {
     * //   time: 2022-04-03T13:00:00.000Z,
     * //   timestamp: 1648990800000,
     * //   duration: -21600000
     * // }
     * ```
     */
    public static casual: (str: string) => ParsedContext | null;

    /**
     * The month name parser for this handler.
     * Accepts inputs such as `in june`, `august`, or `september next year`.
     * Returns a {@link ParsedContext} object.
     * @example
     * ```ts
     * monthName('june next year');
     * // {
     * //   time: 2023-06-01T21:18:55.469Z,
     * //   timestamp: 1685654335469,
     * //   duration: 36633600032
     * // }
     * ```
     */
    public static monthName: (str: string) => ParsedContext | null;
}

interface PatternsMap {
    /**
     * The regex pattern to match a casual string.
     * @example
     * ```ts
     * 'this evening';
     * ```
     */
    casual: RegExp;
    /**
     * The regex patter to match a month name string.
     * @example
     * ```ts
     * 'in august';
     * ```
     */
    monthName: RegExp;
}

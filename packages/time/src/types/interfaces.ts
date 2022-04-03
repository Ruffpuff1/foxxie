export interface ParseDurationOptions {
    /**
     * The mode to use for parsing the string. If not specified, the parser will try to find the best match for the string.
     * The mode option can be used for greater control over the parsing behavior.
     */
    mode: 'casual' | 'monthName';
}

export interface ParsedContext {
    /**
     * The {@link Date} timestamp of the parsed date.
     */
    time: Date;
    /**
     * The epoch timestamp in milliseconds that represents the
     * specified time.
     */
    timestamp: number;
    /**
     * The duration from now to the specified time.
     * Will be negative if the time is in the past.
     */
    duration: number;
}

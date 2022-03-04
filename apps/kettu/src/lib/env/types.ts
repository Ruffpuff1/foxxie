type BooleanString = 'true' | 'false';

export interface KettuEnv {
    CLIENT_VERSION: `${number}.${number}.${number}`;

    DISCORD_TOKEN: string;
    GUILD_IDS: string;

    SAELEM_ENABLED: BooleanString;

    CRYPTOCOMPARE_TOKEN: string;
    GITHUB_TOKEN: string;
    WOLFRAM_TOKEN: string;
}

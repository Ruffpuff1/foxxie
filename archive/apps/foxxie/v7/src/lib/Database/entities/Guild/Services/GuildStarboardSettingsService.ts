import { Snowflake } from 'discord.js';

export class GuildStarboardSettingsService {
    public channel: Snowflake | null = null;

    public emojis: string[] = [];

    public minimum: number = 3;

    public selfStar: boolean = true;

    public constructor(data: Partial<GuildStarboardSettingsService>) {
        Object.assign(this, data);
    }
}

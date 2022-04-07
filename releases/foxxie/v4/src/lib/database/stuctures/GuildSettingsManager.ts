import { GuildEntity } from '../entities/GuildEntity';
import { container } from '@sapphire/framework';
import { Collection } from 'discord.js';

export class GuildSettingsManager extends Collection<string, GuildEntity> {

    public async aquire(key: string, list: (keyof GuildEntity)[] | keyof GuildEntity | ((entity: GuildEntity) => unknown) | string): Promise<any> {
        const settings = this.get(key) ?? (await this.fetch(key));

        if (!list) return settings;

        if (Array.isArray(list)) {
            return list.map((k: keyof GuildEntity) => settings[k]);
        }

        if (typeof list === 'function') {
            return list(settings);
        }

        return settings[list as keyof GuildEntity];
    }

    public async write(key: string, changes: any): Promise<any> {
        const found = this.get(key) || await this.fetch(key);

        try {
            if (typeof changes === 'function') {
                const result = await changes(found);
                await found.save();
                return result;
            }

            await found.save();
            return undefined;
        } catch (err) {
            await found.reload();
            throw err;
        }
    }

    public async fetch(key: string): Promise<GuildEntity> {
        const { guilds } = container.db;
        const existing = await guilds.findOne({ id: key });
        if (existing) {
            this.set(key, existing);
            return existing;
        }

        const created = new GuildEntity();
        created.id = key;
        this.set(key, created);
        await guilds.save(created);

        return created;
    }

}
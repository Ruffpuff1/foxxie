import { GuildSettingsManager } from './GuildSettingsManager';
import { SerializerStore } from './SerializerStore';

export class SettingsManager {
    public readonly serializers = new SerializerStore();

    public readonly guilds = new GuildSettingsManager();
}

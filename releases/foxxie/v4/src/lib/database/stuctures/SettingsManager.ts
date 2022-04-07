import { GuildSettingsManager } from './GuildSettingsManager';
import { TaskStore } from './TaskStore';

export class SettingsManager {

    public readonly guilds = new GuildSettingsManager();
    public readonly tasks = new TaskStore();

}
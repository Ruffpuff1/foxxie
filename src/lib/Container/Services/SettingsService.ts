import { GuildSettingsService } from './GuildSettingService';
import { MemberSettingsService } from './MemberSettingsService';

export class SettingsService {
    public guilds = new GuildSettingsService();

    public members = new MemberSettingsService();
}

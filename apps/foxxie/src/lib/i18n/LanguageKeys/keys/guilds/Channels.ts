import { FT } from '#lib/types';

export const GuildNews = FT<{ context?: 'short'; count?: number }>('guilds/channels:guildNews');
export const GuildStage = FT<{ context?: 'short'; count?: number }>('guilds/channels:guildStage');
export const GuildText = FT<{ context?: 'short'; count?: number }>('guilds/channels:guildText');
export const GuildThread = FT<{ context?: 'short'; count?: number }>('guilds/channels:guildThread');
export const GuildVoice = FT<{ context?: 'short'; count?: number }>('guilds/channels:guildVoice');

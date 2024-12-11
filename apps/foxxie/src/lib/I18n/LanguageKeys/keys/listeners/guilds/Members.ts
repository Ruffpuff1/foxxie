import { FT, T } from '#lib/types';

export const GuildMemberAdd = T('listeners/guilds/guilds-members:guildMemberAdd');
export const GuildMemberAddDescription = FT<{ relativeTime: string; user: string }>('listeners/guilds/guilds-members:guildMemberAddDescription');
export const GuildMemberAddedRoles = FT<{ addedRoles: string; count: number }>('listeners/guilds/guilds-members:guildMemberAddedRoles');
export const GuildMemberAddMute = T('listeners/guilds/guilds-members:guildMemberAddMute');
export const GuildMemberBanned = T('listeners/guilds/guilds-members:guildMemberBanned');
export const GuildMemberKicked = T('listeners/guilds/guilds-members:guildMemberKicked');
export const GuildMemberNoUpdate = T('listeners/guilds/guilds-members:guildMemberNoUpdate');
export const GuildMemberRemove = T('listeners/guilds/guilds-members:guildMemberRemove');
export const GuildMemberRemoveDescription = FT<{ relativeTime: string; user: string }>(
	'listeners/guilds/guilds-members:guildMemberRemoveDescription'
);
export const GuildMemberRemoveDescriptionWithJoinedAt = FT<{ relativeTime: string; user: string }>(
	'listeners/guilds/guilds-members:guildMemberRemoveDescriptionWithJoinedAt'
);
export const GuildMemberRemovedRoles = FT<{ count: number; removedRoles: string }>('listeners/guilds/guilds-members:guildMemberRemovedRoles');
export const GuildMemberSoftBanned = T('listeners/guilds/guilds-members:guildMemberSoftBanned');
export const NameUpdateNextWasNotSet = FT<{ nextName: null | string }>('listeners/guilds/guilds-members:nameUpdateNextWasNotSet');
export const NameUpdateNextWasSet = FT<{ nextName: null | string }>('listeners/guilds/guilds-members:nameUpdateNextWasSet');
export const NameUpdatePreviousWasNotSet = FT<{ previousName: null | string }>('listeners/guilds/guilds-members:nameUpdatePreviousWasNotSet');
export const NameUpdatePreviousWasSet = FT<{ previousName: null | string }>('listeners/guilds/guilds-members:nameUpdatePreviousWasSet');
export const NicknameUpdate = T('listeners/guilds/guilds-members:nicknameUpdate');
export const RoleUpdate = T('listeners/guilds/guilds-members:roleUpdate');
export const UsernameUpdate = T('listeners/guilds/guilds-members:usernameUpdate');

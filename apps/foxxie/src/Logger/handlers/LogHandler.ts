import { container } from '@sapphire/pieces';
import { Event } from '#Foxxie/Core';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getLogger } from '#utils/functions';
import { AuditLogEvent, GatewayDispatchEvents } from 'discord.js';

import { MemberLogHandler } from './MemberLogHandler.js';

export class LogHandler {
	@Event((listener) =>
		listener
			.setEmitter('ws')
			.setEvent(GatewayDispatchEvents.GuildAuditLogEntryCreate)
			.setName(FoxxieEvents.RawGuildAuditLogEntryCreateLoggerTrack)
	)
	public static AuditLogEntryCreate(...[data]: EventArgs<FoxxieEvents.RawGuildAuditLogEntryCreateLoggerTrack>) {
		const guild = container.client.guilds.cache.get(data.guild_id);
		if (!guild) return;

		switch (data.action_type) {
			case AuditLogEvent.ApplicationCommandPermissionUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.ApplicationCommandPermissionUpdate case', data);
			}
			case AuditLogEvent.AutoModerationBlockMessage: {
				return console.log('Not implemented yet: AuditLogEvent.AutoModerationBlockMessage case', data);
			}
			case AuditLogEvent.AutoModerationFlagToChannel: {
				return console.log('Not implemented yet: AuditLogEvent.AutoModerationFlagToChannel case', data);
			}
			case AuditLogEvent.AutoModerationRuleCreate: {
				return console.log('Not implemented yet: AuditLogEvent.AutoModerationRuleCreate case', data);
			}
			case AuditLogEvent.AutoModerationRuleDelete: {
				return console.log('Not implemented yet: AuditLogEvent.AutoModerationRuleDelete case', data);
			}
			case AuditLogEvent.AutoModerationRuleUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.AutoModerationRuleUpdate case', data);
			}
			case AuditLogEvent.AutoModerationUserCommunicationDisabled: {
				return console.log('Not implemented yet: AuditLogEvent.AutoModerationUserCommunicationDisabled case', data);
			}
			case AuditLogEvent.BotAdd: {
				return console.log('Not implemented yet: AuditLogEvent.BotAdd case', data);
			}
			case AuditLogEvent.ChannelCreate: {
				return console.log('Not implemented yet: AuditLogEvent.ChannelCreate case', data);
			}
			case AuditLogEvent.ChannelDelete: {
				return console.log('Not implemented yet: AuditLogEvent.ChannelDelete case', data);
			}
			case AuditLogEvent.ChannelOverwriteCreate: {
				return console.log('Not implemented yet: AuditLogEvent.ChannelOverwriteCreate case', data);
			}
			case AuditLogEvent.ChannelOverwriteDelete: {
				return console.log('Not implemented yet: AuditLogEvent.ChannelOverwriteDelete case', data);
			}
			case AuditLogEvent.ChannelOverwriteUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.ChannelOverwriteUpdate case', data);
			}
			case AuditLogEvent.ChannelUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.ChannelUpdate case', data);
			}
			case AuditLogEvent.CreatorMonetizationRequestCreated: {
				return console.log('Not implemented yet: AuditLogEvent.CreatorMonetizationRequestCreated case', data);
			}
			case AuditLogEvent.CreatorMonetizationTermsAccepted: {
				return console.log('Not implemented yet: AuditLogEvent.CreatorMonetizationTermsAccepted case', data);
			}
			case AuditLogEvent.EmojiCreate: {
				return console.log('Not implemented yet: AuditLogEvent.EmojiCreate case', data);
			}
			case AuditLogEvent.EmojiDelete: {
				return console.log('Not implemented yet: AuditLogEvent.EmojiDelete case', data);
			}
			case AuditLogEvent.EmojiUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.EmojiUpdate case', data);
			}
			case AuditLogEvent.GuildScheduledEventCreate: {
				return console.log('Not implemented yet: AuditLogEvent.GuildScheduledEventCreate case', data);
			}
			case AuditLogEvent.GuildScheduledEventDelete: {
				return console.log('Not implemented yet: AuditLogEvent.GuildScheduledEventDelete case', data);
			}
			case AuditLogEvent.GuildScheduledEventUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.GuildScheduledEventUpdate case', data);
			}
			case AuditLogEvent.GuildUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.GuildUpdate case', data);
			}
			case AuditLogEvent.HomeSettingsCreate: {
				return console.log('Not implemented yet: AuditLogEvent.HomeSettingsCreate case', data);
			}
			case AuditLogEvent.HomeSettingsUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.HomeSettingsUpdate case', data);
			}
			case AuditLogEvent.IntegrationCreate: {
				return console.log('Not implemented yet: AuditLogEvent.IntegrationCreate case', data);
			}
			case AuditLogEvent.IntegrationDelete: {
				return console.log('Not implemented yet: AuditLogEvent.IntegrationDelete case', data);
			}
			case AuditLogEvent.IntegrationUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.IntegrationUpdate case', data);
			}
			case AuditLogEvent.InviteCreate: {
				return console.log('Not implemented yet: AuditLogEvent.InviteCreate case', data);
			}
			case AuditLogEvent.InviteDelete: {
				return console.log('Not implemented yet: AuditLogEvent.InviteDelete case', data);
			}
			case AuditLogEvent.InviteUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.InviteUpdate case', data);
			}
			case AuditLogEvent.MemberBanAdd: {
				return console.log('Not implemented yet: AuditLogEvent.MemberBanAdd case', data);
			}
			case AuditLogEvent.MemberBanRemove: {
				return console.log('Not implemented yet: AuditLogEvent.MemberBanRemove case', data);
			}
			case AuditLogEvent.MemberDisconnect: {
				return console.log('Not implemented yet: AuditLogEvent.MemberDisconnect case', data);
			}
			case AuditLogEvent.MemberKick: {
				return console.log('Not implemented yet: AuditLogEvent.MemberKick case', data);
			}
			case AuditLogEvent.MemberMove: {
				return console.log('Not implemented yet: AuditLogEvent.MemberMove case', data);
			}
			case AuditLogEvent.MemberPrune: {
				return console.log('Not implemented yet: AuditLogEvent.MemberPrune case', data);
			}
			case AuditLogEvent.MemberRoleUpdate:
				return MemberLogHandler.AuditLogEntryCreateMemberRoleUpdate(guild, data);
			case AuditLogEvent.MemberUpdate:
				return MemberLogHandler.AuditLogEntryCreateMemberUpdate(guild, data);
			case AuditLogEvent.MessageBulkDelete:
				return getLogger(guild).prune.setFromAuditLogs(data.target_id!, { userId: data.user_id! });
			case AuditLogEvent.MessageDelete:
				return getLogger(guild).delete.setFromAuditLogs(data.target_id!, { reason: data.reason, userId: data.user_id! });
			case AuditLogEvent.MessagePin: {
				return console.log('Not implemented yet: AuditLogEvent.MessagePin case', data);
			}
			case AuditLogEvent.MessageUnpin: {
				return console.log('Not implemented yet: AuditLogEvent.MessageUnpin case', data);
			}
			case AuditLogEvent.OnboardingCreate: {
				return console.log('Not implemented yet: AuditLogEvent.OnboardingCreate case', data);
			}
			case AuditLogEvent.OnboardingPromptCreate: {
				return console.log('Not implemented yet: AuditLogEvent.OnboardingPromptCreate case', data);
			}
			case AuditLogEvent.OnboardingPromptDelete: {
				return console.log('Not implemented yet: AuditLogEvent.OnboardingPromptDelete case', data);
			}
			case AuditLogEvent.OnboardingPromptUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.OnboardingPromptUpdate case', data);
			}
			case AuditLogEvent.OnboardingUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.OnboardingUpdate case', data);
			}
			case AuditLogEvent.RoleCreate: {
				return console.log('Not implemented yet: AuditLogEvent.RoleCreate case', data);
			}
			case AuditLogEvent.RoleDelete: {
				return console.log('Not implemented yet: AuditLogEvent.RoleDelete case', data);
			}
			case AuditLogEvent.RoleUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.RoleUpdate case', data);
			}
			case AuditLogEvent.SoundboardSoundCreate: {
				return console.log('Not implemented yet: AuditLogEvent.SoundboardSoundCreate case', data);
			}
			case AuditLogEvent.SoundboardSoundDelete: {
				return console.log('Not implemented yet: AuditLogEvent.SoundboardSoundDelete case', data);
			}
			case AuditLogEvent.SoundboardSoundUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.SoundboardSoundUpdate case', data);
			}
			case AuditLogEvent.StageInstanceCreate: {
				return console.log('Not implemented yet: AuditLogEvent.StageInstanceCreate case', data);
			}
			case AuditLogEvent.StageInstanceDelete: {
				return console.log('Not implemented yet: AuditLogEvent.StageInstanceDelete case', data);
			}
			case AuditLogEvent.StageInstanceUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.StageInstanceUpdate case', data);
			}
			case AuditLogEvent.StickerCreate: {
				return console.log('Not implemented yet: AuditLogEvent.StickerCreate case', data);
			}
			case AuditLogEvent.StickerDelete: {
				return console.log('Not implemented yet: AuditLogEvent.StickerDelete case', data);
			}
			case AuditLogEvent.StickerUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.StickerUpdate case', data);
			}
			case AuditLogEvent.ThreadCreate: {
				return console.log('Not implemented yet: AuditLogEvent.ThreadCreate case', data);
			}
			case AuditLogEvent.ThreadDelete: {
				return console.log('Not implemented yet: AuditLogEvent.ThreadDelete case', data);
			}
			case AuditLogEvent.ThreadUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.ThreadUpdate case', data);
			}
			case AuditLogEvent.WebhookCreate: {
				return console.log('Not implemented yet: AuditLogEvent.WebhookCreate case', data);
			}
			case AuditLogEvent.WebhookDelete: {
				return console.log('Not implemented yet: AuditLogEvent.WebhookDelete case', data);
			}
			case AuditLogEvent.WebhookUpdate: {
				return console.log('Not implemented yet: AuditLogEvent.WebhookUpdate case', data);
			}
			default:
				break;
		}
	}
}

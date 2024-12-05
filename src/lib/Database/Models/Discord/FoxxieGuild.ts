import { FoxxieLocale, FoxxieLocaleType, PermissionsNode, ReadonlyGuildData, StickyRole } from '#lib/database';
import { ConsoleState, FoxxieEvents } from '#lib/types';
import { container } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { cast } from '@sapphire/utilities';
import { cyan } from 'colorette';
import { Awaitable, LocaleString } from 'discord.js';
import { getFixedT } from 'i18next';

export class FoxxieGuild {
	public id!: string;

	public prefix!: string;

	public language: FoxxieLocaleType = FoxxieLocale.EnglishUS;

	public disableNaturalPrefix: boolean = false;

	public disabledCommands: string[] = [];

	public permissionsUsers: PermissionsNode[] = [];

	public permissionsRoles: PermissionsNode[] = [];

	public channelsBirthday: string | null = null;

	public channelsMediaOnly: string[] = [];

	public channelsLogsModeration: string | null = null;

	public channelsLogsImage: string | null = null;

	public channelsLogsMemberAdd: string | null = null;

	public channelsLogsMemberRemove: string | null = null;

	public channelsLogsMemberNicknameUpdate: string | null = null;

	public channelsLogsMemberUsernameUpdate: string | null = null;

	public channelsLogsMemberRolesUpdate: string | null = null;

	public channelsLogsMessageDelete: string | null = null;

	public channelsLogsMessageDeleteNsfw: string | null = null;

	public channelsLogsMessageUpdate: string | null = null;

	public channelsLogsMessageUpdateNsfw: string | null = null;

	public channelsLogsPrune: string | null = null;

	public channelsLogsReaction: string | null = null;

	public channelsLogsRoleCreate: string | null = null;

	public channelsLogsRoleDelete: string | null = null;

	public channelsLogsRoleUpdate: string | null = null;

	public channelsLogsChannelCreate: string | null = null;

	public channelsLogsChannelUpdate: string | null = null;

	public channelsLogsChannelDelete: string | null = null;

	public channelsLogsEmojiCreate: string | null = null;

	public channelsLogsEmojiUpdate: string | null = null;

	public channelsLogsEmojiDelete: string | null = null;

	public channelsLogsServerUpdate: string | null = null;

	public channelsLogsVoiceActivity: string | null = null;

	public channelsIgnoreAll: string[] = [];

	public channelsIgnoreMessageEdit: string[] = [];

	public channelsIgnoreMessageDelete: string[] = [];

	public channelsIgnoreReactionAdd: string[] = [];

	public disabledChannels: string[] = [];

	public disabledCommandChannels: [] = [];

	public eventsBanAdd: boolean = true;

	public eventsBanRemove: boolean = true;

	public eventsKick: boolean = true;

	public eventsMuteAdd: boolean = true;

	public eventsMuteRemove: boolean = true;

	public messageCount: number = 0;

	public rolesPersist: StickyRole[] = [];

	// messages stuff

	public rolesBirthday: string | null = null;

	public _data: ReadonlyGuildData;

	public constructor(data: ReadonlyGuildData) {
		// FIX
		this._data = data;
		Object.assign(this, data);
	}

	public getLanguage(): TFunction {
		return getFixedT(cast<LocaleString>(this.language));
	}

	public async incMessageCount(incBy = 1) {
		await this.write((settings) => {
			const newCount = settings.messageCount + incBy;

			container.client.emit(
				FoxxieEvents.Console,
				ConsoleState.Debug,
				`[${cyan('StatsMessage')}] - ${`Updated guild [${cyan(this.id)}] message count - [${cyan(newCount.toLocaleString())}]`}`
			);

			return { messageCount: newCount };
		});
	}

	public write(data: Partial<ReadonlyGuildData> | ((settings: FoxxieGuild) => Awaitable<Partial<ReadonlyGuildData>>)) {
		return container.settings.guilds.writeGuild(this.id, data);
	}

	public get discordGuild() {
		return container.client.guilds.cache.get(this.id);
	}
}

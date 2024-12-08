import { writeSettings } from '#lib/database';
import { acquireMember, createMember, updateMember } from '#lib/Database/Models/member';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { minutes } from '#utils/common';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildMember } from 'discord.js';

@ApplyOptions<ListenerOptions>(({ container }) => ({
	event: FoxxieEvents.StatsMessage,
	enabled: container.client.enabledProdOnlyEvent()
}))
export class UserListener extends Listener<FoxxieEvents.StatsMessage> {
	public timeout = minutes(5);

	public async run(...[guildId, member]: EventArgs<FoxxieEvents.StatsMessage>) {
		// if the member hasn't been in the server for five mintutes disregard the messages.
		if (Date.now() - member.joinedTimestamp! < this.timeout) return [];

		return Promise.all([this.countGuild(guildId), this.countMember(member, guildId)]);
	}

	private async countGuild(guildId: string): Promise<void> {
		await writeSettings(guildId, (settings) => ({ messageCount: settings.messageCount + 1 }));
	}

	private async countMember(member: GuildMember, guildId: string): Promise<void> {
		const memberData = await acquireMember(member.id, guildId);

		if (!memberData) {
			await createMember(member.id, guildId, { messageCount: 1 });
			return;
		}

		await updateMember(member.id, guildId, { messageCount: memberData.messageCount + 1 });
	}
}

import { writeSettings } from '#lib/database';
import { acquireMember, createMember, updateMember } from '#lib/Database/Models/member';
import { ConsoleState, EventArgs, FoxxieEvents } from '#lib/types';
import { minutes } from '#utils/common';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import { cyan } from 'colorette';
import { GuildMember } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	event: FoxxieEvents.StatsMessage,
	enabled: container.client.enabledProdOnlyEvent()
})
export class UserListener extends Listener<FoxxieEvents.StatsMessage> {
	public timeout = minutes(5);

	public async run(...[guildId, member]: EventArgs<FoxxieEvents.StatsMessage>) {
		// if the member hasn't been in the server for five mintutes disregard the messages.
		if (Date.now() - member.joinedTimestamp! < this.timeout) return [];

		return Promise.all([this.countGuild(guildId), this.countMember(member, guildId), this.countClient()]);
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

	private async countClient(): Promise<void> {
		const client = await this.container.db.clients.ensure();
		client.messageCount += 1;
		await client.save();

		this.container.client.emit(
			FoxxieEvents.Console,
			ConsoleState.Debug,
			`[${cyan('StatsMessage')}] - ${`Updated client message count - [${cyan(client.messageCount.toLocaleString())}]`}`
		);
	}
}

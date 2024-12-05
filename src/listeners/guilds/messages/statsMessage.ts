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
		await this.container.settings.guilds.acquire(guildId).then((settings) => settings.incMessageCount());
	}

	private async countMember(member: GuildMember, guildId: string): Promise<void> {
		const memberEntity = await this.container.db.members.ensure(member.id, guildId);
		memberEntity.messageCount += 1;
		await memberEntity.save();

		this.container.client.emit(
			FoxxieEvents.Console,
			ConsoleState.Debug,
			`[${cyan('StatsMessage')}] - ${`Updated member [${cyan(member.displayName)}] message count - [${cyan(memberEntity.messageCount.toLocaleString())}]`}`
		);

		this.container.logger.debug(
			`[${cyan('StatsMessage')}] - ${`Updated member [${cyan(member.displayName)}] message count - [${cyan(memberEntity.messageCount.toLocaleString())}]`}`
		);
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

import { readSettings } from '#lib/database';
import { FoxxieCommand } from '#lib/structures';
import { GuildMemberAddBuilder } from '#utils/discord';
import { Message, MessageEditOptions } from 'discord.js';

export class UserCommand extends FoxxieCommand {
	public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
		const member = await args.pick('member').catch(() => msg.member!);
		const messageId = await args.pick('snowflake');

		const settings = await readSettings(member);
		const logChannelId = settings.channelsLogsMemberAdd;

		const channel = msg.guild?.channels.cache.get(logChannelId!);
		if (!channel || !channel.isSendable()) return this.error('err');

		const message = await channel.messages.fetch(messageId);
		await message.edit(new GuildMemberAddBuilder(args.t).setMember(member).setInvite('HetD8YhF').build() as MessageEditOptions);
	}
}

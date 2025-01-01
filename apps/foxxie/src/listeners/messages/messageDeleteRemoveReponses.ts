import { Listener } from '@sapphire/framework';
import { get } from '@sapphire/plugin-editable-commands';
import { hasAtLeastOneKeyInMap } from '@sapphire/utilities';
import { CommandMatcher, readSettings } from '#lib/database';
import { FoxxieEvents, GuildMessage } from '#lib/types';
import { RegisterListener } from '#utils/decorators';
import { deleteMessage, getCommand } from '#utils/functions';
import { Message } from 'discord.js';

@RegisterListener((listener) => listener.setEvent(FoxxieEvents.MessageDelete))
export class UserListener extends Listener {
	public async run(message: Message): Promise<void> {
		const response = get(message);
		if (response === null) return;

		if (await this.#shouldBeIgnored(message)) return;

		await deleteMessage(response);
	}

	#canBeCustomized(message: Message): message is GuildMessage {
		return message.guild !== null;
	}

	async #shouldBeIgnored(message: Message): Promise<boolean> {
		if (!this.#canBeCustomized(message)) return false;

		const settings = await readSettings(message.guild);

		if (settings.messagesAutoDeleteIgnoredAll) return true;

		if (settings.messagesAutoDeleteIgnoredChannels.includes(message.channelId)) return true;

		if (hasAtLeastOneKeyInMap(message.member.roles.cache, settings.messagesAutoDeleteIgnoredRoles)) return true;

		const command = getCommand(message);
		if (command !== null && CommandMatcher.matchAny(settings.messagesAutoDeleteIgnoredCommands, command)) return true;

		return false;
	}
}

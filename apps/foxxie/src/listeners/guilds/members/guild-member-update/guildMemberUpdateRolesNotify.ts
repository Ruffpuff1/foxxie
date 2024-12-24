import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/database';
import { getT, LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { Colors } from '#utils/constants';
import { getLogger } from '#utils/functions';
import { getFullEmbedAuthor } from '#utils/util';
import { EmbedBuilder, inlineCode } from 'discord.js';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberUpdateRolesNotify
}))
export class UserListener extends Listener {
	public async run(...[member, addedRoles, removedRoles]: EventArgs<FoxxieEvents.GuildMemberUpdateRolesNotify>) {
		const settings = await readSettings(member.guild);
		const t = getT(settings.language);

		const description: string[] = [];

		if (addedRoles.length) {
			description.push(
				`**Roles Added**: ${t(LanguageKeys.Globals.And, {
					value: addedRoles.map((role) => inlineCode(role.name))
				})}`
			);
		}

		if (removedRoles.length) {
			description.push(
				`**Roles Removed**: ${t(LanguageKeys.Globals.And, {
					value: removedRoles.map((role) => inlineCode(role.name))
				})}`
			);
		}

		const timestamp = Date.now();

		const success = await getLogger(member.guild).send({
			channelId: settings.channelsLogsMemberRolesUpdate,
			key: 'channelsLogsMemberRolesUpdate',
			makeMessage: () =>
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setAuthor(getFullEmbedAuthor(member))
					.setDescription(description.join('\n'))
					.setFooter({ text: `Roles Updated` })
					.setTimestamp(timestamp)
		});

		console.log(success);
	}
}

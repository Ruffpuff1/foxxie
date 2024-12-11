import type { GuildMember } from 'discord.js';

import { EmbedBuilder, time, TimestampStyles } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/Database/settings/functions';
import { getT, LanguageKeys } from '#lib/i18n';
import { FoxxieEvents } from '#lib/types';
import { seconds } from '#utils/common';
import { Colors } from '#utils/constants';
import { getLogger } from '#utils/functions';
import { getUserMentionWithFlagsString } from '#utils/functions/users';
import { getFullEmbedAuthor } from '#utils/util';

const Root = LanguageKeys.Listeners.Guilds.Members;

@ApplyOptions<Listener.Options>(({ container }) => ({ enabled: container.client.enabledProdOnlyEvent(), event: FoxxieEvents.NotMutedMemberAdd }))
export class UserListener extends Listener {
	public async run(member: GuildMember) {
		const settings = await readSettings(member);
		const logChannelId = settings.channelsLogsMemberAdd;
		await getLogger(member.guild).send({
			channelId: logChannelId,
			key: 'channelsLogsMemberAdd',
			makeMessage: () => {
				const t = getT(settings.language);
				const { user } = member;
				const description = t(Root.GuildMemberAddDescription, {
					relativeTime: time(seconds.fromMilliseconds(user.createdTimestamp), TimestampStyles.RelativeTime),
					user: getUserMentionWithFlagsString(user.flags?.bitfield ?? 0, user.id)
				});
				return new EmbedBuilder()
					.setColor(Colors.Green)
					.setAuthor(getFullEmbedAuthor(member.user))
					.setDescription(description)
					.setFooter({ text: t(Root.GuildMemberAdd) })
					.setTimestamp();
			}
		});
	}
}

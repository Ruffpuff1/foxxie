import type { GuildMember } from 'discord.js';

import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/Database/settings/functions';
import { getT } from '#lib/i18n';
import { FoxxieEvents } from '#lib/types';
import { Colors } from '#utils/constants';
import { GuildMemberAddBuilder } from '#utils/discord';
import { getLogger } from '#utils/functions';

@ApplyOptions<Listener.Options>(({ container }) => ({ enabled: container.client.enabledProdOnlyEvent(), event: FoxxieEvents.NotMutedMemberAdd }))
export class UserListener extends Listener {
	public async run(member: GuildMember) {
		const settings = await readSettings(member);
		const logChannelId = settings.channelsLogsMemberAdd;
		const t = getT(settings.language);
		const invite = this.container.client.invites.memberUseCache.get(`${member.guild.id}_${member.id}`);

		await getLogger(member.guild).send({
			channelId: logChannelId,
			key: 'channelsLogsMemberAdd',
			makeMessage: () =>
				new GuildMemberAddBuilder(t) //
					.setColor(Colors.Green)
					.setMember(member)
					.setInvite(invite)
					.build()
		});
	}
}

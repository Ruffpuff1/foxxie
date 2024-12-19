import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/Database/settings/functions';
import { getT } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { UserBuilder } from '#utils/builders';
import { getLogger } from '#utils/functions';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberAddNotMuted
}))
export class UserListener extends Listener {
	public async run(...[member]: EventArgs<FoxxieEvents.GuildMemberAddNotMuted>) {
		const settings = await readSettings(member);

		await getLogger(member.guild).send({
			channelId: settings.channelsLogsMemberAdd,
			key: 'channelsLogsMemberAdd',
			makeMessage: () => UserBuilder.MemberAddLog(member, getT(settings.language))
		});
	}
}

import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/database/settings/functions';
import { getT } from '#lib/i18n';
import { FoxxieEvents } from '#lib/types';
import { UserBuilder } from '#utils/builders';
import { getLogger } from '#utils/functions';
import { type GatewayGuildMemberRemoveDispatchData, type Guild, GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.RawMemberRemove
}))
export class UserListener extends Listener {
	public async run(guild: Guild, member: GuildMember | null, { user }: GatewayGuildMemberRemoveDispatchData) {
		if (member instanceof GuildMember) this.container.client.emit(FoxxieEvents.GuildMemberCountChannelUpdate, member);

		const fetchedUser = await resolveToNull(this.container.client.users.fetch(user.id));
		if (!fetchedUser) return;

		const settings = await readSettings(guild);

		await getLogger(guild).send({
			channelId: settings.channelsLogsMemberRemove,
			key: 'channelsLogsMemberRemove',
			makeMessage: () => UserBuilder.MemberRemoveLog(member, guild, fetchedUser, getT(settings.language))
		});
	}
}

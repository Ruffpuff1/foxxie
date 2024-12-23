import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { floatPromise } from '#utils/common';
import { blue } from 'colorette';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberCountChannelUpdate
}))
export class UserListener extends Listener {
	#channelId = '812226377717645332';

	public override async onLoad() {
		const channel = await resolveToNull(this.container.client.channels.fetch(this.#channelId));

		if (!channel || !channel.isVoiceBased()) return;

		const t = await fetchT(channel);
		const memberCount = t(LanguageKeys.Globals.NumberFormat, { value: channel.guild.memberCount });
		const format = this.#format(memberCount);

		if (channel.name !== format) {
			await floatPromise(channel.setName(format));
			this.container.logger.debug(`[${blue('The Corner Store')}]: Attempted to set member count channel to ${memberCount}`);
		}
	}

	public async run(...[member]: EventArgs<FoxxieEvents.GuildMemberCountChannelUpdate>) {
		const { guild } = member;
		const t = await fetchT(guild);

		const channel = await resolveToNull(guild.channels.fetch(this.#channelId));
		if (!channel || channel.guildId !== guild.id) return;

		const memberCount = t(LanguageKeys.Globals.NumberFormat, { value: guild.memberCount });
		const format = this.#format(memberCount);

		if (channel.name !== format) {
			await floatPromise(channel.setName(format));
			this.container.logger.debug(`[${blue('The Corner Store')}]: Attempted to set member count channel to ${memberCount}`);
		}
	}

	#format(count: string) {
		return `🥤┇Members・${count}`;
	}
}

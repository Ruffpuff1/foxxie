import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { isNullish, Nullish } from '@sapphire/utilities';
import { writeSettings } from '#lib/database';
import { getT, LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { toErrorCodeResult } from '#utils/common';
import { Colors } from '#utils/constants';
import { GuildMemberAddBuilder } from '#utils/discord';
import { getLogger, getLogPrefix } from '#utils/functions';
import { Guild, type GuildMember, RESTJSONErrorCodes, type Snowflake } from 'discord.js';

const Root = LanguageKeys.Listeners.Guilds.Members;

@ApplyOptions<Listener.Options>(({ container }) => ({ enabled: container.client.enabledProdOnlyEvent(), event: FoxxieEvents.GuildMemberAddMuted }))
export class UserListener extends Listener {
	public async run(...[member, settings]: EventArgs<FoxxieEvents.GuildMemberAddMuted>) {
		return Promise.all([
			this.#handleMutedMemberAddRole(member, settings.rolesMuted!),
			this.#handleMutedMemberNotify(getT(settings.language), member, settings.channelsLogsMemberAdd)
		]);
	}

	async #handleMutedMemberAddRole(member: GuildMember, mutedRoleId: Snowflake) {
		const { guild } = member;
		const role = guild.roles.cache.get(mutedRoleId);
		if (isNullish(role)) {
			await writeSettings(member, { rolesMuted: null });
		} else {
			getLogger(guild).mute.set(member.id, { userId: this.container.client.id! });
			const result = await toErrorCodeResult(member.roles.add(role));
			await result.inspectErrAsync((code) => this.#handleMutedMemberAddRoleErr(guild, code, member.id));
		}
	}

	async #handleMutedMemberAddRoleErr(guild: Guild, code: RESTJSONErrorCodes, userId: string) {
		getLogger(guild).mute.unset(userId);
		// The member left the guild before we could add the role, ignore:
		if (code === RESTJSONErrorCodes.UnknownMember) return;

		// The role was deleted, remove it from the settings:
		if (code === RESTJSONErrorCodes.UnknownRole) {
			await writeSettings(guild, { rolesMuted: null });
			return;
		}

		// Otherwise, log the error:
		this.container.logger.error(`${getLogPrefix(this)} Failed to add the muted role to a member.`);
	}

	async #handleMutedMemberNotify(t: TFunction, member: GuildMember, targetChannelId: Nullish | Snowflake) {
		const invite = this.container.client.invites.memberUseCache.get(`${member.guild.id}_${member.id}`);

		await getLogger(member.guild).send({
			channelId: targetChannelId,
			key: 'channelsLogsMemberAdd',
			makeMessage: () =>
				new GuildMemberAddBuilder(t) //
					.setColor(Colors.Yellow)
					.setMember(member)
					.setInvite(invite)
					.setFooterKey(Root.AddMuted)
					.build()
		});
	}
}

import { TFunction } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';
import { seconds } from '#utils/common';
import { Colors } from '#utils/constants';
import { getFullEmbedAuthor } from '#utils/util';
import { GuildMember, hyperlink, inlineCode, time, TimestampStyles } from 'discord.js';

import { FoxxieBuilder } from './base/FoxxieBuilder.js';

const Root = LanguageKeys.Listeners.Guilds.Members;

export class GuildMemberAddBuilder extends FoxxieBuilder {
	public invite: null | string = null;

	public member!: GuildMember;

	public t: TFunction;

	public constructor(t: TFunction) {
		super();

		this.t = t;
	}

	public override build() {
		const { user } = this.member;

		this.setColor(Colors.Green)
			.setAuthor(getFullEmbedAuthor(this.member, `https://discord.com/users/${user.id}`))
			.setDescription(this.#formatDescription())
			.setFooter({ text: this.t(Root.GuildMemberAdd) })
			.setTimestamp(this.member.joinedTimestamp);

		return super.build();
	}

	public setInvite(code: null | string) {
		this.invite = code;
		return this;
	}

	public setMember(member: GuildMember) {
		this.member = member;
		return this;
	}

	#formatDescription() {
		const createdLine = `**Created**: ${time(this.memberCreatedSeconds, TimestampStyles.LongDate)} (${time(this.memberCreatedSeconds, TimestampStyles.RelativeTime)})`;
		const positionLine = `**Position**: ${this.t(LanguageKeys.Globals.NumberOrdinal, { value: this.memberPosition })}`;
		const inviteLine = this.invite ? `**Invite**: ${hyperlink(inlineCode(this.invite), `https://discord.gg/${this.invite}`)}` : null;

		return [createdLine, inviteLine, positionLine].filter((a) => a !== null);
	}

	private get memberCreatedSeconds() {
		return seconds.fromMilliseconds(this.member.user.createdTimestamp);
	}

	private get memberPosition() {
		return (
			this.member.guild.members.cache
				.sort((a, b) => (a.joinedTimestamp || 0) - (b.joinedTimestamp || 0))
				.map((s) => s.id)
				.findIndex((m) => m === this.member.id) + 1
		);
	}
}

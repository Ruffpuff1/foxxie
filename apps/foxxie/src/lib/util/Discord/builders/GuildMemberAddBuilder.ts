import { LanguageKeys } from '#lib/i18n';
import { TypedT } from '#lib/types';
import { discordInviteLink, userLink } from '#utils/transformers';
import { getFullEmbedAuthor } from '#utils/util';
import { GuildMember, hyperlink, inlineCode } from 'discord.js';

import { FoxxieBuilder } from './base/FoxxieBuilder.js';

const Root = LanguageKeys.Listeners.Guilds.Members;

export class GuildMemberAddBuilder extends FoxxieBuilder {
	public footerKey: TypedT<string> = Root.Add;

	public invite: null | string = null;

	public member!: GuildMember;

	public override build() {
		const { user } = this.member;

		this.setAuthor(getFullEmbedAuthor(this.member, userLink(user.id)))
			.setDescription(this.#formatDescription())
			.setFooter({ text: this.t(this.footerKey) })
			.setTimestamp(this.member.joinedTimestamp);

		return super.build();
	}

	public setFooterKey(key: TypedT<string>) {
		this.footerKey = key;
		return this;
	}

	public setInvite(code: null | string | undefined) {
		this.invite = code || null;
		return this;
	}

	public setMember(member: GuildMember) {
		this.member = member;
		return this;
	}

	#formatDescription() {
		const createdLine = this.t(Root.AddCreated, { time: this.memberTimestamp });
		const positionLine = this.t(Root.AddPosition, { position: this.memberPosition });
		const inviteLine = this.invite
			? this.t(Root.AddInvite, { invite: hyperlink(inlineCode(this.invite), discordInviteLink(this.invite)) })
			: null;

		return [createdLine, inviteLine, positionLine].filter((a) => a !== null);
	}

	private get memberPosition() {
		return (
			this.member.guild.members.cache
				.sort((a, b) => (a.joinedTimestamp || 0) - (b.joinedTimestamp || 0))
				.map((s) => s.id)
				.findIndex((m) => m === this.member.id) + 1
		);
	}

	private get memberTimestamp() {
		return this.member.user.createdTimestamp;
	}
}

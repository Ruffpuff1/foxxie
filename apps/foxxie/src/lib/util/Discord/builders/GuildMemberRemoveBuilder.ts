import { toTitleCase } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { TypedT } from '#lib/types';
import { userLink } from '#utils/transformers';
import { getFullEmbedAuthor } from '#utils/util';
import { Colors, GuildMember, User } from 'discord.js';

import { FoxxieBuilder } from './base/FoxxieBuilder.js';

const Root = LanguageKeys.Listeners.Guilds.Members;

export class GuildMemberRemoveBuilder extends FoxxieBuilder {
	public footerKey: TypedT<string> = Root.Remove;

	public member: GuildMember | null = null;

	public messageCount = 0;

	public user!: User;

	public override build() {
		this.setAuthor(getFullEmbedAuthor(this.member || this.user, userLink(this.user.id)))
			.setDescription(this.#formatDescription())
			.setColor(Colors.Red)
			.setFooter({ text: this.t(this.footerKey) })
			.setTimestamp(Date.now());

		return super.build();
	}

	public setFooterKey(key: TypedT<string>) {
		this.footerKey = key;
		return this;
	}

	public setMember(member: GuildMember | null) {
		this.member = member;
		return this;
	}

	public setMessageCount(count: null | number) {
		this.messageCount = count || 0;
		return this;
	}

	public setUser(user: User) {
		this.user = user;
		return this;
	}

	#formatDescription() {
		const joinedTimestamp = this.#processJoinedTimestamp();

		const joinedLine = joinedTimestamp === -1 ? this.t(Root.RemoveJoinedUnknown) : this.t(Root.RemoveJoined, { time: joinedTimestamp });
		const messagesLine = this.t(Root.RemoveMessages, {
			value: this.messageCount
				? this.t(LanguageKeys.Globals.NumberFormat, { value: this.messageCount })
				: toTitleCase(this.t(LanguageKeys.Globals.None))
		});

		return [joinedLine, messagesLine].filter((a) => a !== null);
	}

	#processJoinedTimestamp() {
		if (this.member === null) return -1;
		if (this.member.joinedTimestamp === null) return -1;
		return this.member.joinedTimestamp;
	}
}

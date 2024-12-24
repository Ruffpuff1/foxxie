import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { cast } from '@sapphire/utilities';
import { Collection, GuildMember, RESTGetAPIInviteResult, Routes, Snowflake } from 'discord.js';

export type InviteCode = {
	fetchedAt: number;
} & (InviteCodeInvalid | InviteCodeValid);

export interface InviteCodeInvalid {
	valid: false;
}

export interface InviteCodeValid {
	code: string;
	guild?: {
		id: string;
		name: string;
	};
	valid: true;
}

export class InviteManager extends Collection<string, InviteCode> {
	public memberUseCache = new Collection<string, string>();

	public usesCache = new Collection<Snowflake, Collection<string, null | number>>();

	public async fetch(code: string, force = false) {
		if (!force) {
			const previous = this.get(code);
			if (typeof previous !== 'undefined') return previous;
		}

		const data = await resolveToNull(cast<Promise<RESTGetAPIInviteResult>>(container.client.rest.get(Routes.invite(code))));
		if (data === null) {
			const resolved: InviteCode = {
				fetchedAt: Date.now(),
				valid: false
			};
			this.set(code, resolved);
			return resolved;
		}

		const resolved: InviteCode = {
			code,
			fetchedAt: Date.now(),
			valid: true
		};

		if (Reflect.has(data, 'guild')) {
			resolved.guild = {
				id: data.guild!.id,
				name: data.guild!.name
			};
		}

		this.set(code, resolved);
		return resolved;
	}

	public async findUsedInvite(member: GuildMember): Promise<null | string> {
		const fetchedInvites = await member.guild.invites.fetch();
		const cachedInvites = this.usesCache.get(member.guild.id);
		if (!cachedInvites) return null;

		const usedInvite = fetchedInvites.find((invite) => {
			const cached = cachedInvites.get(invite.code);
			if (!cached || !invite.uses) return false;

			return invite.uses > cached;
		});

		const inviteCode = usedInvite?.code || null;

		if (inviteCode) {
			this.memberUseCache.set(`${member.guild.id}_${member.id}`, inviteCode);
			cachedInvites.set(usedInvite!.code, usedInvite!.uses);
		}

		return inviteCode;
	}
}

import { cast, resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { Collection, RESTGetAPIInviteResult, Routes } from 'discord.js';

export class InviteManager extends Collection<string, InviteCode> {
    public async fetch(code: string, force = false) {
        if (!force) {
            const previous = this.get(code);
            if (typeof previous !== 'undefined') return previous;
        }

        const data = await resolveToNull(cast<Promise<RESTGetAPIInviteResult>>(container.client.rest.get(Routes.invite(code))));
        if (data === null) {
            const resolved: InviteCode = {
                valid: false,
                fetchedAt: Date.now()
            };
            this.set(code, resolved);
            return resolved;
        }

        const resolved: InviteCode = {
            valid: true,
            code,
            fetchedAt: Date.now()
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
}

export type InviteCode = (InviteCodeInvalid | InviteCodeValid) & {
    fetchedAt: number;
};

export interface InviteCodeValid {
    valid: true;
    code: string;
    guild?: {
        id: string;
        name: string;
    };
}

export interface InviteCodeInvalid {
    valid: false;
}

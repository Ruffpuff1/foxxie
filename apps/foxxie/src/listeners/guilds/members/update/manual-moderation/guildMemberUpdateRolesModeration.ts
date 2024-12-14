import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/database';
import { EventArgs, FoxxieEvents } from '#lib/types';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberUpdateRolesModeration
}))
export class UserListener extends Listener {
	public async run(...[member, added, removed]: EventArgs<FoxxieEvents.GuildMemberUpdateRolesModeration>) {
		const { eventsMuteAdd, eventsMuteRemove, rolesMuted } = await readSettings(member);

		const addedIds = added.map((role) => role.id);
		const removedIds = removed.map((role) => role.id);

		if (this.#shouldContinue(addedIds, rolesMuted, eventsMuteAdd)) {
			this.container.client.emit(FoxxieEvents.GuildMemberUpdateRolesManualMute, member);
		}

		if (this.#shouldContinue(removedIds, rolesMuted, eventsMuteRemove)) {
			this.container.client.emit(FoxxieEvents.GuildMemberUpdateRolesManualUnmute, member);
		}
	}

	#shouldContinue(ids: string[], roleId: null | string, settingsKey: boolean) {
		if (!roleId) return false;
		return ids.includes(roleId) && settingsKey;
	}
}

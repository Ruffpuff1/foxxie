import { readSettings } from '#lib/Database/settings/functions';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getModeration } from '#utils/functions';
import { TypeVariation } from '#utils/moderationConstants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: FoxxieEvents.GuildBanAdd
}))
export class UserListener extends Listener {
	public async run(...[{ guild, user, reason }]: EventArgs<FoxxieEvents.GuildBanAdd>) {
		if (!guild.available) return;

		const settings = await readSettings(guild);
		if (!guild.available || !settings.eventsBanAdd) return;

		const moderation = getModeration(guild);
		await moderation.waitLock();

		if (moderation.checkSimilarEntryHasBeenCreated(TypeVariation.Ban, user.id)) return;
		await moderation.insert(moderation.create({ user: user.id, type: TypeVariation.Ban, reason: reason || null }));
	}
}

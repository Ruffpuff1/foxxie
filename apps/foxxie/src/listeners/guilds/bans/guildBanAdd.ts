import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/database/settings/functions';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getModeration } from '#utils/functions';
import { TypeVariation } from '#utils/moderationConstants';

@ApplyOptions(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: FoxxieEvents.GuildBanAdd
}))
export class UserListener extends Listener {
	public async run(...[{ guild, reason, user }]: EventArgs<FoxxieEvents.GuildBanAdd>) {
		if (!guild.available) return;

		const settings = await readSettings(guild);
		if (!guild.available || !settings.eventsBanAdd) return;

		const moderation = getModeration(guild);
		await moderation.waitLock();

		if (moderation.checkSimilarEntryHasBeenCreated(TypeVariation.Ban, user.id)) return;
		await moderation.insert(moderation.create({ reason: reason || null, type: TypeVariation.Ban, user: user.id }));
	}
}

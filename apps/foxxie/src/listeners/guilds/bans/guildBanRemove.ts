import { readSettings } from '#lib/Database/settings/functions';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getModeration } from '#utils/functions';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildBanRemove
}))
export class UserListener extends Listener {
	public async run(...[{ guild, user }]: EventArgs<FoxxieEvents.GuildBanRemove>) {
		if (!guild.available) return;

		const settings = await readSettings(guild);
		if (!guild.available || !settings.eventsBanRemove) return;

		const moderation = getModeration(guild);
		await moderation.waitLock();

		if (moderation.checkSimilarEntryHasBeenCreated(TypeVariation.Ban, user.id)) return;
		await moderation.insert(moderation.create({ user, type: TypeVariation.Ban, metadata: TypeMetadata.Undo }));
	}
}

import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { hours } from '#utils/common';
import { Schedules } from '#utils/constants';

@ApplyOptions({
	enabled: container.client.enabledProdOnlyEvent(),
	name: FoxxieEvents.MessageCreateBotDisboard
})
export class UserListener extends Listener<FoxxieEvents.MessageCreateBotRealmBot> {
	public async run(...[message]: EventArgs<FoxxieEvents.MessageCreateBotRealmBot>): Promise<void> {
		const [embed] = message.embeds;
		const description = embed.description?.toLowerCase();

		if (!description || !description.startsWith(`bump done!`)) return;
		await this.container.schedule.add(Schedules.Disboard, Date.now() + hours(2), {
			data: { guildId: message.guild.id }
		});
	}
}

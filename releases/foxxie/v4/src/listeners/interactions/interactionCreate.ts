import { Interaction, Constants } from 'discord.js';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { events } from '../../lib/util';

@ApplyOptions<ListenerOptions>({
    event: Constants.Events.INTERACTION_CREATE
})
export class FoxxieListener extends Listener {

    async run(interaction: Interaction): Promise<void> {
        if (interaction.isCommand()) this.container.client.emit(events.SLASH_COMMAND_CREATE, interaction);
    }

}
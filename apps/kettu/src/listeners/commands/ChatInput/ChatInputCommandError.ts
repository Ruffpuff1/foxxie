import { Events } from '#types/Events';
import type { EventArgs } from '@foxxie/types';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions, UserError } from '@sapphire/framework';
import { RESTJSONErrorCodes } from 'discord-api-types/v10';
import { DiscordAPIError } from 'discord.js';

const ignoredCodes = [RESTJSONErrorCodes.InteractionHasAlreadyBeenAcknowledged, RESTJSONErrorCodes.UnknownInteraction];

@ApplyOptions<ListenerOptions>({
    event: Events.ChatInputCommandError
})
export class UserListener extends Listener<Events.ChatInputCommandError> {
    public run(...[error]: EventArgs<Events.ChatInputCommandError>) {
        if (error instanceof UserError) {
            console.log(error); //
            return; //
        }

        if (error instanceof DiscordAPIError) {
            if (ignoredCodes.includes(error.code)) return;
        }

        throw error;
    }
}

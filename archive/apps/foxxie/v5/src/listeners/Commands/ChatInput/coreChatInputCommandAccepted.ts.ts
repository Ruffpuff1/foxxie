import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandAcceptedPayload, fromAsync, isErr, Listener, ListenerOptions, Events } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import type { FoxxieCommand } from 'lib/structures';
import { FoxxieChatInputArgs } from '#lib/structures';
import { Stopwatch } from '@sapphire/stopwatch';
import type { Events as FoxxieEvents } from '#lib/types';

@ApplyOptions<ListenerOptions>({
    name: 'CoreChatInputCommandAccepted',
    event: Events.ChatInputCommandAccepted
})
export class UserListener extends Listener<FoxxieEvents.ChatInputCommandAccepted> {
    public async run(payload: ChatInputCommandAcceptedPayload & { command: FoxxieCommand }) {
        const { command, context, interaction } = payload;
        const result = await fromAsync(async () => {
            this.container.client.emit(Events.ChatInputCommandRun, interaction, command, { ...payload });

            const stopwatch = new Stopwatch();
            const color = await this.container.db.fetchColor(interaction);
            const t = await fetchT(interaction.channel!);
            const { duration } = stopwatch.stop();

            const args = new FoxxieChatInputArgs(interaction, t, command, color);

            const result = await command.chatInputRun(interaction, context, args);
            this.container.client.emit(Events.ChatInputCommandSuccess, {
                ...payload,
                result,
                duration
            });

            return duration;
        });
        if (isErr(result)) {
            this.container.client.emit(Events.ChatInputCommandError, result.error, {
                ...payload,
                duration: result.value ?? -1
            });
        }
        this.container.client.emit(Events.ChatInputCommandFinish, interaction, command, {
            ...payload,
            duration: result.value ?? -1
        });
    }
}

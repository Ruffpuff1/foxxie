import { EventArgs, FoxxieEvents } from '#lib/types';
import { Listener } from '@sapphire/framework';
import { blue } from 'colorette';

export class UserListener extends Listener<FoxxieEvents.ChatInputCommandLogging> {
    public run(...[interaction, command]: EventArgs<FoxxieEvents.ChatInputCommandLogging>): void {
        const shard = interaction.guild ? interaction.guild.shardId : 0;
        this.container.logger.debug(
            [
                `[${blue(shard)}]`,
                `-`,
                `/${blue(command.name)}`,
                interaction.user.username,
                `[${blue(interaction.user.id)}]`,
                interaction.guild?.name,
                `[${blue(interaction.guild!.id)}]`
            ].join(' ')
        );
    }
}

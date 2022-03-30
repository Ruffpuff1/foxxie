import { Command } from '@sapphire/framework';
import { RegisterChatInputCommand } from '@foxxie/commands';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import { enUS, getGuildIds } from '#utils/util';
import owoify from 'owoify-js';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Owoify)
            .setDescription(LanguageKeys.Commands.Tools.OwoifyDescription)
            .addStringOption(option =>
                option //
                    .setName('text')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.OwoifyOptionText))
                    .setRequired(true)
            )
            .addStringOption(option =>
                option //
                    .setName('mode')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.OwoifyOptionMode))
                    .setRequired(false)
                    .setChoices([
                        ['◝(owo)◜ OwO', 'owo'],
                        ['(/ />⁄ω⁄</ /)/ UwU', 'uwu'],
                        ['(∮UvU◆ χ) UvU', 'uvu']
                    ])
            )
            .addEphemeralOption(),
    {
        idHints: ['953403239146082324'],
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    public override chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Owoify>): Promise<any> {
        const { text, ephemeral, mode } = args!;
        const owoMode = mode ?? undefined;

        const content = owoify
            // @ts-expect-error this libraries typings appear to be wrong.
            .default(text, owoMode)
            .replace(/`/g, '`') // lgtm [js/identity-replacement]
            .replace(/\*/g, '*'); // lgtm [js/identity-replacement]

        return interaction.reply({ content: `**Owoified**: ${content}`, ephemeral });
    }
}

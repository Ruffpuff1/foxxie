import { Command } from '@sapphire/framework';
import { RegisterChatInputCommand } from '#utils/decorators';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';
import owoify from 'owoify-js';

@RegisterChatInputCommand(
    CommandName.Owoify,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.Tools.OwoifyDescription))
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
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                    .setRequired(false)
            ),
    ['953403239146082324']
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

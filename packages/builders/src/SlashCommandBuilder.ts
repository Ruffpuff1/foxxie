import type { CustomGet } from '@foxxie/types';
import i18next from 'i18next';
import { SlashCommandBuilder as BaseBuilder } from '@discordjs/builders';
import { SlashCommandSubcommandBuilder } from './SlashCommandSubcommandBuilder';

export class SlashCommandBuilder extends BaseBuilder {
    public setDescription(key: CustomGet<string, string> | 'subcommand'): this {
        return super.setDescription(i18next.t(key, { lng: 'en-US' }));
    }

    public subcommand(
        input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)
    ): SlashCommandSubcommandsOnlyBuilder {
        const result = typeof input === 'function' ? input(new SlashCommandSubcommandBuilder()) : input;

        return super.addSubcommand(result) as unknown as SlashCommandSubcommandsOnlyBuilder;
    }

    public addEphemeralOption(base = false) {
        return super.addBooleanOption(option =>
            option //
                .setName('ephemeral')
                .setDescription(i18next.t(`system:optionEphemeralDefault${base ? 'True' : 'False'}`, { lng: 'en-US' }))
        ) as this;
    }
}

export interface SlashCommandSubcommandsOnlyBuilder
    extends Pick<SlashCommandBuilder, 'toJSON' | 'addSubcommand' | 'addSubcommandGroup' | 'setName' | 'setDescription' | 'subcommand'> {}

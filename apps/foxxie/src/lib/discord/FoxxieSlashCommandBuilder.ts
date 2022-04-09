import type { CustomGet } from '@foxxie/types';
import i18next from 'i18next';
import { SlashCommandBuilder } from '@discordjs/builders';
import { FoxxieSlashCommandSubcommandBuilder } from './FoxxieSlashCommandSubcommandBuilder';

export class FoxxieSlashCommandBuilder extends SlashCommandBuilder {
    public setDescription(key: CustomGet<string, string> | 'subcommand'): this {
        return super.setDescription(i18next.t(key, { lng: 'en-US' }));
    }

    public subcommand(
        input: FoxxieSlashCommandSubcommandBuilder | ((subcommandGroup: FoxxieSlashCommandSubcommandBuilder) => FoxxieSlashCommandSubcommandBuilder)
    ): FoxxieSlashCommandSubcommandsOnlyBuilder {
        const result = typeof input === 'function' ? input(new FoxxieSlashCommandSubcommandBuilder()) : input;

        return super.addSubcommand(result) as unknown as FoxxieSlashCommandSubcommandsOnlyBuilder;
    }

    public addEphemeralOption(base = false) {
        return super.addBooleanOption(option =>
            option //
                .setName('ephemeral')
                .setDescription(i18next.t(`system:optionEphemeralDefault${base ? 'True' : 'False'}`, { lng: 'en-US' }))
        ) as this;
    }
}

export interface FoxxieSlashCommandSubcommandsOnlyBuilder
    extends Pick<FoxxieSlashCommandBuilder, 'toJSON' | 'addSubcommand' | 'addSubcommandGroup' | 'setName' | 'setDescription' | 'subcommand'> {}

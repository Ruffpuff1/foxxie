import type { CustomGet } from '#lib/types';
import { enUS } from '#utils/util';
import { SlashCommandBuilder } from '@discordjs/builders';
import { FoxxieSlashCommandSubcommandBuilder } from './FoxxieSlashCommandSubcommandBuilder';

export class FoxxieSlashCommandBuilder extends SlashCommandBuilder {
    public setDescription(key: CustomGet<string, string> | 'subcommand'): this {
        return super.setDescription(enUS(key));
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
                .setDescription(enUS(`system:optionEphemeralDefault${base ? 'True' : 'False'}`))
        ) as this;
    }
}

export interface FoxxieSlashCommandSubcommandsOnlyBuilder extends Pick<FoxxieSlashCommandBuilder, 'toJSON' | 'addSubcommand' | 'addSubcommandGroup' | 'setName' | 'setDescription' | 'subcommand'> {}

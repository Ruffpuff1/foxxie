import type { CustomGet } from '#lib/types';
import { enUS } from '#utils/util';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';

export class FoxxieSlashCommandSubcommandBuilder extends SlashCommandSubcommandBuilder {
    public setDescription(key: CustomGet<string, string>): this {
        return super.setDescription(enUS(key));
    }

    public addEphemeralOption(base = false) {
        return super.addBooleanOption(option =>
            option //
                .setName('ephemeral')
                .setDescription(enUS(`system:optionEphemeralDefault${base ? 'True' : 'False'}`))
        ) as this;
    }
}

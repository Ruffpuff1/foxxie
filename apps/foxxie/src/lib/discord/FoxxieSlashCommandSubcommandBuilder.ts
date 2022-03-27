import type { CustomGet } from '@foxxie/types';
import i18next from 'i18next';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';

export class FoxxieSlashCommandSubcommandBuilder extends SlashCommandSubcommandBuilder {
    public setDescription(key: CustomGet<string, string>): this {
        return super.setDescription(i18next.t(key, { lng: 'en-US' }));
    }

    public addEphemeralOption(base = false) {
        return super.addBooleanOption(option =>
            option //
                .setName('ephemeral')
                .setDescription(i18next.t(`system:optionEphemeralDefault${base ? 'True' : 'False'}`, { lng: 'en-US' }))
        ) as this;
    }
}
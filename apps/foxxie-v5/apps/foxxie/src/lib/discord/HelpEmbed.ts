import { LanguageKeys } from '#lib/i18n';
import type { FoxxieCommand } from '#lib/structures';
import type { CustomGet, HelpDisplayData } from '#lib/types';
import { BrandingColors } from '#utils/constants';
import { LongWidthSpace, toTitleCase } from '@ruffpuff/utilities';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import { MessageEmbed } from 'discord.js';

export class HelpEmbed extends MessageEmbed {
    public command: FoxxieCommand;

    public constructor() {
        super();
    }

    public setCommand(command: FoxxieCommand): this {
        this.command = command;
        return this;
    }

    public display(t: TFunction, prefix = process.env.CLIENT_PREFIX, color = BrandingColors.Primary, fullMenu = false): this {
        const titles = t(LanguageKeys.Commands.General.HelpTitles);

        const { client } = this.command.container;
        const icon = client.user!.displayAvatarURL();
        const isServerOnly = this.command.options.runIn ? !this.command.options.runIn.includes(CommandOptionsRunTypeEnum.Dm) : false;

        this.setColor(color)
            .setAuthor({
                name: `${toTitleCase(this.command.name)}${this.command.aliases.length ? ` (${this.command.aliases.join(', ')})` : ''}`,
                iconURL: icon
            })
            .setDescription(t(this.command.description));

        const data = t(this.command.detailedDescription as CustomGet<string, HelpDisplayData>, {
            replace: { prefix, count: this.command.store.size },
            postProcess: 'helpUsage'
        });

        if (data.usages?.length) {
            this.addField(
                isServerOnly ? `${titles.usage} ${titles.serverOnly}` : titles.usage,
                data.usages.map(usage => `${prefix}${this.command.name}${usage ? ` *${usage}*` : ''}`).join('\n')
            );
        } else {
            this.addField(isServerOnly ? `${titles.usage} ${titles.serverOnly}` : titles.usage, `${prefix}${this.command.name}`);
        }

        if (fullMenu) {
            if (data.extendedHelp) this.addField(titles.extendedHelp, data.extendedHelp);

            if (data.explainedUsage?.length)
                this.addField(
                    titles.explainedUsage,
                    data.explainedUsage
                        .map(([arg, desc]) => `• **${arg}**: ${Array.isArray(desc) ? `\n${desc.map(d => `${LongWidthSpace}→ ${d}`).join('\n')}` : desc}`)
                        .join('\n')
                );
            // dunno if this looks good or not.
            // if (data.examples?.length) this.addField(titles.examples, data.examples.map(example => `${prefix}${this.command.name}${example ? ` *${example}*` : ''}`).join('\n'));
            // else this.addField(titles.examples, `${prefix}${this.command.name}`);
        }

        this.addField(titles.permNode, `\`${this.command.category!.toLowerCase()}.${this.command.name.toLowerCase()}\``);

        return this;
    }
}

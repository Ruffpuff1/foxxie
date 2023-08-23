import { configurableGroups, isSchemaGroup, isSchemaKey, remove, reset, SchemaKey, set } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { inlineCode } from '@discordjs/builders';
import { filter, map, toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['config', 'settings'],
    guarded: true,
    description: LanguageKeys.Commands.Configuration.ConfDescription,
    permissionLevel: PermissionLevels.Administrator,
    usage: LanguageKeys.Commands.Configuration.ConfUsage,
    subCommands: [{ input: 'add', output: 'set' }, 'set', { input: 'show', default: true }, 'remove', 'reset']
})
export default class UserCommand extends FoxxieCommand {
    // @RequiresClientPermissions([
    //     PermissionFlagsBits.EmbedLinks,
    //     PermissionFlagsBits.ManageMessages,
    //     PermissionFlagsBits.AddReactions
    // ])
    // public menu(message: GuildMessage, args: FoxxieCommand.Args, context: FoxxieCommand.Context) {
    //     return new SettingsMenu(message, args.t).init(context);
    // }

    public async set(message: GuildMessage, args: FoxxieCommand.Args) {
        const [key, schemaKey] = await this.fetchKey(args);
        const response = await this.container.db.guilds.write(message.guild.id, async settings => {
            await set(settings, schemaKey, args);
            return schemaKey.display(settings, args.t);
        });

        return send(message, {
            content: args.t(LanguageKeys.Commands.Configuration.ConfUpdated, {
                key,
                response: inlineCode(response)
            }),
            allowedMentions: { users: [], roles: [] }
        });
    }

    public async show(message: GuildMessage, args: FoxxieCommand.Args) {
        const key = args.finished ? '' : await args.pick('string');
        const schemaValue = configurableGroups.getPathString(key.toLowerCase());
        if (schemaValue === null) this.error(LanguageKeys.Commands.Configuration.ConfGetNoExist, { key });

        const output = await this.container.db.guilds.acquire(message.guild.id, settings => {
            return schemaValue.display(settings, args.t);
        });

        if (isSchemaKey(schemaValue)) {
            return send(message, {
                content: args.t(LanguageKeys.Commands.Configuration.ConfGet, {
                    key: schemaValue.name,
                    value: output
                }),
                allowedMentions: { users: [], roles: [] }
            });
        }

        const title = key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '';

        return send(message, {
            content: args.t(LanguageKeys.Commands.Configuration.ConfServer, {
                key: title,
                list: output
            }),
            allowedMentions: { users: [], roles: [] }
        });
    }

    public async remove(message: GuildMessage, args: FoxxieCommand.Args) {
        const [key, schemaKey] = await this.fetchKey(args);
        const response = await this.container.db.guilds.write(message.guild.id, async settings => {
            await remove(settings, schemaKey, args);
            return schemaKey.display(settings, args.t);
        });

        return send(message, {
            content: args.t(LanguageKeys.Commands.Configuration.ConfUpdated, {
                key,
                response: inlineCode(response)
            }),
            allowedMentions: { users: [], roles: [] }
        });
    }

    public async reset(message: GuildMessage, args: FoxxieCommand.Args) {
        const [key, schemaKey] = await this.fetchKey(args);
        const response = await this.container.db.guilds.write(message.guild.id, settings => {
            reset(settings, schemaKey);
            return schemaKey.display(settings, args.t);
        });

        return send(message, {
            content: args.t(LanguageKeys.Commands.Configuration.ConfReset, {
                key,
                value: response
            }),
            allowedMentions: { users: [], roles: [] }
        });
    }

    private async fetchKey(args: FoxxieCommand.Args) {
        const key = await args.pick('string');
        const value = configurableGroups.getPathString(key.toLowerCase());

        if (value === null) this.error(LanguageKeys.Commands.Configuration.ConfGetNoExist, { key });
        if (isSchemaGroup(value)) {
            this.error(LanguageKeys.Commands.Configuration.ConfValidationChooseKey, {
                keys: [
                    ...map(
                        filter(value.childValues(), value => !value.dashboardOnly),
                        value => `\`${value.name}\``
                    )
                ]
            });
        }

        return [value.name, value as SchemaKey] as const;
    }
}

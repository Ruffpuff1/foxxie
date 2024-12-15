import { FoxxieCommand, SettingsMenu } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { inlineCode } from '@discordjs/builders';
import { configurableGroups, isSchemaGroup, isSchemaKey, remove, reset, SchemaKey, set } from '#lib/database';
import { filter, map, toTitleCase } from '@ruffpuff/utilities';
import { send } from '@sapphire/plugin-editable-commands';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['config', 'settings'],
    guarded: true,
    description: LanguageKeys.Commands.Admin.ConfDescription,
    detailedDescription: LanguageKeys.Commands.Admin.ConfDetailedDescription,
    permissionLevel: PermissionLevels.Administrator,
    runIn: [CommandOptionsRunTypeEnum.GuildAny],
    subCommands: ['set', { input: 'add', output: 'set' }, 'show', 'remove', 'reset', { input: 'menu', default: true }]
})
export class UserCommand extends FoxxieCommand {
    public async menu(msg: GuildMessage, args: FoxxieCommand.Args, context: FoxxieCommand.Context): Promise<void> {
        return new SettingsMenu(msg, args.t).init(context);
    }

    public async show(message: GuildMessage, args: FoxxieCommand.Args) {
        const key = args.finished ? '' : await args.pick('string');
        const schemaValue = configurableGroups.getPathString(key.toLowerCase());
        if (schemaValue === null) this.error(LanguageKeys.Commands.Admin.ConfGetNoExist, { key });

        const output = await args.acquire(settings => {
            return schemaValue.display(settings, args.t);
        });

        if (isSchemaKey(schemaValue)) {
            return send(message, {
                content: args.t(LanguageKeys.Commands.Admin.ConfGet, {
                    key: schemaValue.name,
                    value: output
                }),
                allowedMentions: { users: [], roles: [] }
            });
        }

        const title = key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '';
        return send(message, {
            content: args.t(LanguageKeys.Commands.Admin.ConfServer, {
                key: title,
                list: output
            }),
            allowedMentions: { users: [], roles: [] }
        });
    }

    public async set(message: GuildMessage, args: FoxxieCommand.Args) {
        const [key, schemaKey] = await this.fetchKey(args);
        const response = await args.write(async settings => {
            await set(settings, schemaKey, args);
            return schemaKey.display(settings, args.t);
        });

        return send(message, {
            content: args.t(LanguageKeys.Commands.Admin.ConfUpdated, {
                key,
                response: inlineCode(response)
            }),
            allowedMentions: { users: [], roles: [] }
        });
    }

    public async remove(message: GuildMessage, args: FoxxieCommand.Args) {
        const [key, schemaKey] = await this.fetchKey(args);
        const response = await args.write(async settings => {
            await remove(settings, schemaKey, args);
            return schemaKey.display(settings, args.t);
        });

        return send(message, {
            content: args.t(LanguageKeys.Commands.Admin.ConfUpdated, {
                key,
                response: inlineCode(response)
            }),
            allowedMentions: { users: [], roles: [] }
        });
    }

    public async reset(message: GuildMessage, args: FoxxieCommand.Args) {
        const [key, schemaKey] = await this.fetchKey(args);
        const response = await args.write(settings => {
            reset(settings, schemaKey);
            return schemaKey.display(settings, args.t);
        });

        return send(message, {
            content: args.t(LanguageKeys.Commands.Admin.ConfReset, {
                key,
                value: response
            }),
            allowedMentions: { users: [], roles: [] }
        });
    }

    private async fetchKey(args: FoxxieCommand.Args) {
        const key = await args.pick('string');
        const value = configurableGroups.getPathString(key.toLowerCase());
        if (value === null) this.error(LanguageKeys.Commands.Admin.ConfGetNoExist, { key });
        if (isSchemaGroup(value)) {
            this.error(LanguageKeys.Commands.Admin.ConfValidationChooseKey, {
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

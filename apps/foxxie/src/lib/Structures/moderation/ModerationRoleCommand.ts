import { GuildRoleSettingsService } from '#lib/Database/entities/Guild/Services/GuildRoleSettingsService';
import { LanguageKeys } from '#lib/I18n';
import { GuildMessage } from '#lib/Types';
import { isAdmin, messagePrompt, promptForMessage } from '#utils/Discord';
import { bold } from '@discordjs/builders';
import { cast } from '@ruffpuff/utilities';
import { Argument, PieceContext } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { PickByValue } from '@sapphire/utilities';
import { Role, Snowflake } from 'discord.js';
import { ModerationSetupRestriction } from './ModerationActions';
import { ModerationCommand } from './ModerationCommand';

export abstract class ModerationRoleCommand extends ModerationCommand {
    public readonly roleKey: PickByValue<GuildRoleSettingsService, Snowflake | null>;

    public readonly setUpKey: ModerationSetupRestriction;

    public constructor(context: PieceContext, options: ModerationRoleCommand.Options) {
        super(context, options);
        this.roleKey = options.roleKey;
        this.setUpKey = options.setUpKey;
    }

    public async messageRun(message: GuildMessage, args: ModerationCommand.Args, context: ModerationCommand.Context) {
        await this.inhibit(message, args, context);
        return super.messageRun(message, args, context);
    }

    public async inhibit(message: GuildMessage, args: ModerationCommand.Args, context: ModerationCommand.Context) {
        const { settings } = this.container.utilities.guild(message.guild);
        const [id, t] = await settings.get(settings => [settings.roles[this.roleKey], settings.getLanguage()]);

        // Verify for role existence.
        const role = (id && message.guild.roles.cache.get(id)) ?? null;
        if (role) return undefined;

        if (!isAdmin(message.member)) {
            this.error(LanguageKeys.Moderation.RestrictLowLevel);
        }

        if (await messagePrompt(message, t(LanguageKeys.Moderation.ActionSharedRoleSetupExisting))) {
            const role = await this.askForRole(message, args, context);
            if (!role.isOk()) return this.error(role.unwrapErr());
            await settings.set(settings => (settings.roles[this.roleKey] = role.unwrap().id));
        } else if (await messagePrompt(message, t(LanguageKeys.Moderation.ActionsharedRoleSetupNew))) {
            const role = await this.container.utilities.guild(message.guild).moderation.actions.setUpRole(message, this.setUpKey);

            const content = t(LanguageKeys.Moderation.ActionSharedRoleSetupSuccess, { role: bold(role.name) });
            await send(message, content);
        } else {
            this.error(LanguageKeys.System.CommandCancel);
        }

        return undefined;
    }

    protected async askForRole(message: GuildMessage, args: ModerationRoleCommand.Args, context: ModerationRoleCommand.Context) {
        const result = await promptForMessage(message, args.t(LanguageKeys.Moderation.ActionSharedRoleSetupExistingName));
        if (result === null) this.error(LanguageKeys.Moderation.ActionSharedRoleSetupNoMessage);

        const argument = this.role;
        return argument.run(result, { args, argument, command: this, commandContext: context, message });
    }

    private get role() {
        return cast<Argument<Role>>(this.container.stores.get('arguments').get('role'));
    }
}

export namespace ModerationRoleCommand {
    export interface Options extends ModerationCommand.Options {
        roleKey: PickByValue<GuildRoleSettingsService, Snowflake | null>;
        setUpKey: ModerationSetupRestriction;
    }

    export type Args = ModerationCommand.Args;
    export type Context = ModerationCommand.Context;
}

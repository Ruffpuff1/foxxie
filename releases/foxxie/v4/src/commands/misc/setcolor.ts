import { ColorResolvable, DiscordAPIError, GuildMember, Message, Permissions } from 'discord.js';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { FoxxieCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { reactNo, reactYes } from '../../lib/util';
import { send } from '@sapphire/plugin-editable-commands';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['sc', 'setcolour'],
    requiredClientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
    requiredUserPermissions: [Permissions.FLAGS.MANAGE_ROLES],
    description: languageKeys.commands.misc.setcolor.description,
    detailedDescription: languageKeys.commands.misc.setcolor.extendedUsage
})
export default class extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const role = await args.pick('role');
        const { hex } = await args.pick('color');
        const reason = await args.rest('string').catch(() => undefined);

        try {
            await role.setColor(hex as ColorResolvable, reason as string | undefined);
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.MissingPermissions) {
                const myRole = msg.guild?.roles.botRoleFor(msg.guild?.me as GuildMember);
                return send(msg, args.t(languageKeys.commands.misc.setcolor.noPerms, { context: myRole?.id === role.id ? 'mine' : '' }));
            } else {
                await reactNo(msg);
            }
        }
        await reactYes(msg);
        return msg;
    }

}
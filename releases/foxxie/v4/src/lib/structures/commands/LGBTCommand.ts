import { FoxxieCommand } from './FoxxieCommand';
import { Permissions, Message, GuildMember, User } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { Urls, sendLoading } from '../../util';
import fetch from '@foxxie/centra';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';

@ApplyOptions<FoxxieCommand.Options>({
    requiredClientPermissions: [Permissions.FLAGS.ATTACH_FILES],
    runIn: [CommandOptionsRunTypeEnum.GuildAny],
    flags: ['overlay', 'o', 'u', 'user']
})
export class LGBTCommand extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const entity = await this.getEntity(msg, args);
        const overlay = args.getFlags('o', 'overlay');
        const loading = await sendLoading(msg);

        const attachment = await fetch(Urls.Lgbt)
            .path(overlay ? 'overlay' : 'circle')
            .query({ image: entity?.displayAvatarURL({ size: 2048, format: 'png' }), type: this.name })
            .raw();

        send(msg, { files: [{ attachment, name: 'pride.png' }] });
        return loading.delete();
    }

    async getEntity(msg: Message, args: FoxxieCommand.Args): Promise<GuildMember | User | null> {
        const userFlag = args.getFlags('u', 'user');

        return args.finished
            ? msg[userFlag ? 'author' : 'member']
            : userFlag
                ? args.pick('user')
                : args.pick('member')
                    .catch(async () => args.pick('user')
                        .catch(() => msg[userFlag ? 'author' : 'member'])
                    );
    }

}
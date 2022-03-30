import { FoxxieCommand } from './FoxxieCommand';
import type { Message, GuildMember, User } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { sendLoadingMessage } from '#utils/util';
import { seconds } from '@ruffpuff/utilities';
import { BucketScope, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Canvas, resolveImage } from 'canvas-constructor/skia';
import type { GuildMessage } from '#lib/types';
import { PermissionFlagsBits } from 'discord-api-types/v9';

const w = 1024;
const h = 1024;

@ApplyOptions<LGBTCommand.Options>({
    requiredClientPermissions: PermissionFlagsBits.AttachFiles,
    runIn: [CommandOptionsRunTypeEnum.GuildAny],
    flags: ['u', 'user'],
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User
})
export class LGBTCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: LGBTCommand.Args): Promise<Message> {
        const entity = await this.getEntity(msg, args);
        await sendLoadingMessage(msg);

        const attachment = await this.lgbtImage(entity!.displayAvatarURL({ format: 'png', size: 1024 }));

        return send(msg, { files: [{ attachment, name: 'pride.png' }] });
    }

    private async getEntity(msg: GuildMessage, args: LGBTCommand.Args): Promise<GuildMember | User | null> {
        const userFlag = args.getFlags('u', 'user');

        if (args.finished) {
            return userFlag ? msg.author : msg.member;
        }

        if (userFlag) {
            return args.pick('username').catch(() => msg[userFlag ? 'author' : 'member']);
        }

        return args.pick('member').catch(() => msg[userFlag ? 'author' : 'member']);
    }

    private async lgbtImage(url: string): Promise<Buffer> {
        const canvas = await new Canvas(w, h)
            .printCircle(w / 2, h / 2, w / 2)
            .setColor('rgb(255, 255, 255, 0)')
            .fill()
            .png()
            .then(resolveImage);

        const iUrl = `https://raw.githubusercontent.com/Ruffpuff1/foxxie/main/apps/foxxie/assets/pride/${this.name}.png`;

        const attachment = await new Canvas(w, h)
            .printImage(canvas, 0, 0)
            .printCircularImage(await resolveImage(url), w / 2, h / 2, w / 2)
            .printImage(await resolveImage(iUrl), 0, 0)
            .png();

        return attachment;
    }
}

export namespace LGBTCommand {
    export type Options = FoxxieCommand.Options;
    export type Args = FoxxieCommand.Args;
}

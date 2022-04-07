/*
* Credit goes to [Stitch07](https://github.com/Stitch07) and [ravy](https://ravy.pink).
* (c) [The Aero Team](https://aero.bot) 2021
*/
import { FoxxieCommand } from '../../lib/structures';
import { randomArray } from '@ruffpuff/utilities';
import { Message, MessageReaction, Permissions, TextChannel, User } from 'discord.js';
import { languageKeys } from '../../lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { Connect4 } from '../../lib/games';
import { send } from '@sapphire/plugin-editable-commands';
import type { TFunction } from '@sapphire/plugin-i18next';
import { sendTemporaryMessage } from '../../lib/util';

const connect4s = new Map();

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['c4'],
    requiredClientPermissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.ADD_REACTIONS],
    description: languageKeys.commands.games.connect4Description,
    detailedDescription: languageKeys.commands.games.connect4ExtendedUsage
})
export default class extends FoxxieCommand {

    public yesNo: string[] = ['✔', '✖'];

    public numbers: string[] = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '⏹'];

    public channels = new Map();

    async messageRun(message: Message, args: FoxxieCommand.Args): Promise<Message | void> {
        const c4 = this.connect4(message.channel as TextChannel);
        const member = await args.pick('member');

        if (this.channels.has(message.channel.id)) this.error(languageKeys.commands.games.connect4Occuring);
        if (member.user.bot) this.error(languageKeys.commands.games.connect4NoBots);
        if (member.user.id === message.author.id) this.error(languageKeys.commands.games.connect4Yourself);

        const queryToken = message.mentions.members?.has(member.id) ? member.displayName : member.toString();
        const msg = await send(message, { content: args.t(languageKeys.commands.games.connect4Challenge, {
            user: queryToken, author: message.author.tag
        }) });
        // adding the yes/No emoji for asking the mentioned user to either play the game or not.
        const check = await awaitReaction(member.user, msg);
        if (!check) {
            await msg.reactions.removeAll();
            this.error(languageKeys.commands.games.connect4Declined, { author: message.author.toString() });
        }

        await msg.reactions.removeAll();
        c4.startGame(message, member.user);
        this.channels.set(msg.channel.id, true);
        msg.edit(this.getLoadingMsg(args.t));

        await c4.initialReact(msg);
        return this.handleProgress(msg, c4, message, args.t);
    }

    getLoadingMsg(t: TFunction): string {
        const langArr = t(languageKeys.commands.games.loading);
        const picked: string = randomArray(t(languageKeys.commands.games.loading) as unknown as ArrayConstructor);
        const number = langArr.indexOf(picked);

        return t(`${languageKeys.commands.games.loading}.${number}`);
    }

    connect4(channel: TextChannel): Connect4 {
        return connect4s.has(channel.id) ? connect4s.get(channel.id) : connect4s.set(channel.id, new Connect4(channel)).get(channel.id);
    }

    async handleProgress(msg: Message, c4: Connect4, message: Message, t: TFunction): Promise<void> {
        const { players, choice } = c4;
        const usr = players[choice % 2];

        await msg.edit(`${c4.turnTable(t)}`);

        msg.awaitReactions({ filter: (reaction, user) => user.id === usr && this.numbers.includes(reaction.emoji.toString()), idle: 60000 * 2, max: 1, errors: ['time'] })
            .then(async reactions => {
                const res = reactions.first() as MessageReaction;
                if (res.emoji.name === '⏹') {
                    await c4.reset();
                    await msg.reactions.removeAll();
                    this.channels.delete(msg.channel.id);

                    const opponent = await this.container.client.users.fetch(usr).then(user => user.tag).catch(() => t(languageKeys.commands.games.opponent));
                    return this.error(languageKeys.commands.games.connect4Quit, { opponent });
                }
                const column = this.numbers.indexOf(res.emoji.name as string);

                // if the column is full
                if (!c4.checkColumnPossible(column)) {
                    const user = await this.container.client.users.fetch(usr).then(user => user.toString()).catch(() => t(languageKeys.commands.games.opponent));
                    await sendTemporaryMessage(msg, t(languageKeys.commands.games.connect4CollumnFull, { user }));
                    await res.users.remove(usr);
                    return this.handleProgress(msg, c4, message, t);
                }

                // if the selected move is possible
                c4.updateTable(usr, column);
                // checking if game is over
                const win = c4.check(usr);
                if (win) {
                    const user = await msg.guild?.members.fetch(usr).then(member => `**${member.displayName}**`).catch(() => t(languageKeys.commands.games.opponent));
                    const output = `${t(languageKeys.commands.games.connect4Win, { user })}\n\n${c4.getTable()}`;
                    // cleanup
                    c4.reset();
                    msg.reactions.removeAll();
                    this.channels.delete(msg.channel.id);
                    return msg.edit(output);
                }
                // checking if no further move is possible
                const draw = c4.checkNoMove();
                if (draw) {
                    const output = `${t(languageKeys.commands.games.connect4MaxMoves)}\n${c4.getTable()}`;
                    c4.reset();
                    msg.reactions.removeAll();
                    this.channels.delete(msg.channel.id);

                    return msg.edit(output);
                }
                c4.choice += 1;
                await res.users.remove(usr);
                return this.handleProgress(msg, c4, message, t);
            })
            .catch(() => {
                c4.reset();
                msg.reactions.removeAll();
                this.channels.delete(msg.channel.id);

                this.error(languageKeys.commands.games.connect4Timeout);
            });
    }

}

const awaitReaction = async (user: User, message: Message) => {
    await message.react('🇾');
    await message.react('🇳');
    const data = await message.awaitReactions({ filter: reaction => reaction.users.cache.has(user.id), time: 60000 * 2, max: 1 });
    if (data.firstKey() === '🇾') return true;
    return false;
};

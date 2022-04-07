/*
* Credit goes to [Stitch07](https://github.com/Stitch07) and [ravy](https://ravy.pink).
* (c) [The Aero Team](https://aero.bot) 2021
*/
import { connect4Emojis } from '../util';
import { languageKeys } from '../i18n';
import type { Message, TextChannel, User } from 'discord.js';
import type { TFunction } from '@sapphire/plugin-i18next';

const emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '⏹'];
const { C4_EMPTY, PLAYER1, PLAYER2, PLAYER1_WIN, PLAYER2_WIN } = connect4Emojis;

export class Connect4 {

    public status = 'idle';

    public players: string[] = [];

    public choice = 0;

    public table: string[][] = [
        [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
        [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
        [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
        [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
        [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
        [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY]
    ];

    public constructor(textChannel: TextChannel) {
        Object.defineProperty(this, 'guild', { value: textChannel.guild });
        Object.defineProperty(this, 'client', { value: textChannel.client });
    }

    getTable(): string {
        const output = this.table.map(array => array.join('')).join('\n');
        return output;
    }

    // react with all the numbers
    async initialReact(msg: Message): Promise<void> {
        for (const emoji of emojis) {
            await msg.react(emoji);
        }
    }

    // the table self-produced for every turn
    turnTable(t: TFunction): string {
        let output = t(languageKeys.commands.games.connect4CurrentTurn);
        output += `<@${this.players[this.choice % 2]}>\n\n`;
        output += this.getTable();
        return output;
    }

    // check column
    checkColumnPossible(num: number): boolean {
        for (let i = this.table.length - 1; i >= 0; i--) {
            if (this.table[i][num] === C4_EMPTY) return true;
        }
        return false;
    }

    // check if further moves are possible in the game
    checkNoMove(): boolean {
        for (let i = 0; i < this.table[0].length; i++) {
            for (let j = 0; j < this.table.length; j++) {
                if (this.table[i][j] === C4_EMPTY) return false;
            }
        }
        return true;
    }

    // updating the table
    updateTable(user: string, num: number): void {
        const color = this.getColor(user);
        for (let i = this.table.length - 1; i >= 0; i--) {
            if (this.table[i][num] === C4_EMPTY) {
                this.table[i][num] = color;
                return;
            }
        }
    }

    // initially start the table.
    startGame(message: Message, user: User): string[] {
        this.players.push(message.author.id, user.id);
        this.status = 'playing';
        return this.players;
    }

    // get the color of the user
    getColor(userId: string): string {
        const pos = this.players.indexOf(userId);
        const color = pos % 2 === 0 ? PLAYER1 : PLAYER2;
        return color;
    }

    // get the proper winning color according to the user color
    getWinColor(color: string): string {
        return color === PLAYER1 ? PLAYER1_WIN : PLAYER2_WIN;
    }

    /* eslint-disable complexity  */
    check(user: string): boolean {
        const { table } = this;
        const player = this.getColor(user);
        const winCol = this.getWinColor(player);
        // horizontal check
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                const row = table[i];
                if (row[j] === player && row[j + 1] === player && row[j + 2] === player && row[j + 3] === player) {
                    this.table[i][j] = winCol;
                    this.table[i][j + 1] = winCol;
                    this.table[i][j + 2] = winCol;
                    this.table[i][j + 3] = winCol;
                    return true;
                }
            }
        }
        // vertical check
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 7; j++) {
                if (table[i][j] === player && table[i + 1][j] === player && table[i + 2][j] === player && table[i + 3][j] === player) {
                    this.table[i][j] = winCol;
                    this.table[i + 1][j] = winCol;
                    this.table[i + 2][j] = winCol;
                    this.table[i + 3][j] = winCol;
                    return true;
                }
            }
        }
        // right diagonal check
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                if (table[i][j] === player && table[i + 1][j + 1] === player && table[i + 2][j + 2] === player && table[i + 3][j + 3] === player) {
                    this.table[i][j] = winCol;
                    this.table[i + 1][j + 1] = winCol;
                    this.table[i + 2][j + 2] = winCol;
                    this.table[i + 3][j + 3] = winCol;
                    return true;
                }
            }
        }
        // left diagonal check
        for (let i = 0; i < 3; i++) {
            for (let j = 3; j < 7; j++) {
                if (table[i][j] === player && table[i + 1][j - 1] === player && table[i + 2][j - 2] === player && table[i + 3][j - 3] === player) {
                    this.table[i][j] = winCol;
                    this.table[i + 1][j - 1] = winCol;
                    this.table[i + 2][j - 2] = winCol;
                    this.table[i + 3][j - 3] = winCol;
                    return true;
                }
            }
        }
        return false;
    }

    // complete reset the information in the table
    reset(): boolean {
        this.status = 'idle';
        this.players = [];
        this.choice = 0;
        this.table = [
            [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
            [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
            [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
            [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
            [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY],
            [C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY, C4_EMPTY]
        ];
        return true;
    }

}
import type { CommandInteractionOption, User, Role, GuildBasedChannel } from 'discord.js';
import { parseArgs } from '../src';
import type { APIUser, APIRole, APIChannel } from 'discord-api-types/v9';

const mockUser: APIUser = {
    username: 'Ruffpuff',
    avatar: 'a',
    discriminator: '0017',
    id: '486396074282450946'
};

const mockRole: APIRole = {
    id: '903867488075390987',
    name: 'Pumpkin',
    color: 0,
    position: 0,
    managed: false,
    mentionable: false,
    hoist: false,
    permissions: '0'
};

const mockChannel: APIChannel = {
    id: '826893949880631379',
    type: 0,
    name: 'general',
    position: 0
};

describe('Argument parsing', () => {
    const options: CommandInteractionOption[] = [
        {
            name: 'string',
            type: 'STRING',
            value: 'a string'
        },
        {
            name: 'subcommand',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'string',
                    type: 'STRING',
                    value: 'a string'
                }
            ]
        },
        {
            name: 'subcommand_noargs',
            type: 'SUB_COMMAND'
        },
        {
            name: 'user',
            type: 'USER',
            user: mockUser as unknown as User
        },
        {
            name: 'role',
            type: 'ROLE',
            role: mockRole as unknown as Role
        },
        {
            name: 'channel',
            type: 'CHANNEL',
            channel: mockChannel as unknown as GuildBasedChannel
        }
    ];

    test('WHEN expecting a string option return "a string"', () => {
        const parsed = parseArgs(options, {});

        expect(parsed.string).toEqual('a string');
    });

    test('WHEN expecting a subcommand with one string option, return the object', () => {
        const parsed = parseArgs(options, {});

        expect(parsed.subcommand.string).toEqual('a string');
    });

    test("WHEN expecting a user argument, expect the user's username to be a string", () => {
        const parsed = parseArgs(options, {});

        expect(typeof parsed.user.user.username).toEqual('string');
    });

    test("WHEN expecting a role argument, expect the role's name to be a string", () => {
        const parsed = parseArgs(options, {});

        expect(typeof parsed.role.name).toEqual('string');
    });

    test("WHEN expecting a channel argument, expect the channel's name to be a string", () => {
        const parsed = parseArgs(options, {});

        expect(typeof parsed.channel.name).toEqual('string');
    });
});

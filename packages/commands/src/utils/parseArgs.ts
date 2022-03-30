import type { CommandInteractionOption } from 'discord.js';

export function parseArgs(options: CommandInteractionOption[], raw: Record<string, any>) {
    for (const arg of options) {
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (arg.type) {
            case 'SUB_COMMAND':
            case 'SUB_COMMAND_GROUP':
                raw[arg.name] = parseArgs(arg.options ? [...arg.options] : [], {});
                break;
            case 'USER':
                raw[arg.name] = { user: arg.user, member: arg.member };
                break;
            case 'CHANNEL':
                raw[arg.name] = arg.channel;
                break;
            case 'ROLE':
                raw[arg.name] = arg.role;
                break;
            default:
                raw[arg.name] = arg.value;
        }
    }

    return raw;
}

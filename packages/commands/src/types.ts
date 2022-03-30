import type { CommandOptions } from '@sapphire/framework';

export type CommandOptionsWithIdHintsAndGuildIds = CommandOptions & { idHints?: string[]; guildIds?: string[] };

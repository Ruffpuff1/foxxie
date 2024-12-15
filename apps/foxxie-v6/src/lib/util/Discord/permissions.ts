import { PermissionFlagsBits } from 'discord-api-types/v10';
import { Permissions } from 'discord.js';

export const sendMessages = new Permissions([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]);

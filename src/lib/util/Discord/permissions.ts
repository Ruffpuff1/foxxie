import { PermissionFlagsBits } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export const sendMessages = new PermissionsBitField([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]);

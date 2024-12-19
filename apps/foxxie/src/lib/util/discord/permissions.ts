import { PermissionFlagsBits, PermissionsBitField } from 'discord.js';

export const sendMessages = new PermissionsBitField([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]);

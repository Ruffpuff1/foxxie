import { Listener } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';
import { resolveClientColor } from '#utils/util';
import { APIEmbed, APIEmbedField, ClientEvents, EmbedBuilder, GuildMember } from 'discord.js';

const enum Matches {
	Count = '{guild.count}',
	CreatedAt = '{user.createdat}',
	Discrim = '{user.discrim}',
	Guild = '{guild}',
	JoinedAt = '{user.joinedat}',
	Mention = '{user.mention}',
	Name = '{user.name}',
	Position = '{user.position}',
	Tag = '{user.tag}'
}

export abstract class AutomationListener<T extends keyof ClientEvents = keyof ClientEvents> extends Listener<T> {
	private matchRegex = /{user\.(mention|name|tag|discrim|position|createdat|joinedat)}|{guild(\.(splash|count))?}/g;

	public abstract override run(...args: T extends keyof ClientEvents ? ClientEvents[T] : unknown[]): Promise<unknown>;

	protected format(message: string, member: GuildMember, t: TFunction) {
		return message.replace(this.matchRegex, (match) => {
			switch (match.toLowerCase()) {
				case Matches.Count:
					return t(LanguageKeys.Globals.NumberFormat, {
						value: member.guild.memberCount
					});
				case Matches.CreatedAt:
					return t(LanguageKeys.Globals.FullDateTime, {
						date: member.user.createdAt
					});
				case Matches.Discrim:
					return member.user.discriminator;
				case Matches.Guild:
					return member.guild.name;
				case Matches.JoinedAt:
					return t(LanguageKeys.Globals.FullDateTime, {
						date: member.joinedAt
					});
				case Matches.Mention:
					return member.toString();
				case Matches.Name:
					return member.displayName;
				case Matches.Position:
					return t(LanguageKeys.Globals.NumberOrdinal, {
						value: member.guild.memberCount
					});
				default:
					return '';
			}
		});
	}

	protected async retriveAutomationContent(
		member: GuildMember,
		t: TFunction,
		message: null | string,
		embed: APIEmbed | null,
		defaultMsg: string
	): Promise<[APIEmbed[], string | undefined]> {
		const embeds: APIEmbed[] = [];
		const parsedMessage = this.format(message || defaultMsg, member, t);
		const content = message ? parsedMessage : embed ? undefined : parsedMessage;

		if (embed) embeds.push(await this.prepareEmbed(embed, member, t));

		return [embeds, content];
	}

	private async prepareEmbed(embedData: APIEmbed, member: GuildMember, t: TFunction): Promise<APIEmbed> {
		const embed = new EmbedBuilder(embedData);

		embed.setColor(await resolveClientColor(member.guild)).setThumbnail(member.displayAvatarURL());

		const embedResolved = embed.toJSON();

		if (embedResolved.description) embed.setDescription(this.format(embedResolved.description, member, t));

		if (embedResolved.title) embed.setTitle(this.format(embedResolved.title, member, t));

		if (embedResolved.footer?.text)
			embed.setFooter({
				iconURL: embedResolved.footer.icon_url,
				text: this.format(embedResolved.footer.text, member, t)
			});

		const fields: APIEmbedField[] = [];
		if (embedResolved.fields) {
			for (const field of embedResolved.fields) {
				fields.push({
					inline: field.inline,
					name: this.format(field.name, member, t),
					value: this.format(field.value, member, t)
				});
			}
		}

		embed.setFields(fields);

		return embed.toJSON();
	}
}

// eslint-disable-next-line no-redeclare
export namespace AutomationListener {
	export type Options = Listener.Options;
}

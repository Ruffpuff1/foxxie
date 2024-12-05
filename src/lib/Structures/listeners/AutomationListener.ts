import { LanguageKeys } from '#lib/i18n';
import { resolveClientColor } from '#utils/util';
import { Listener } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { APIEmbed, APIEmbedField, ClientEvents, EmbedBuilder, GuildMember } from 'discord.js';

export abstract class AutomationListener<T extends keyof ClientEvents = keyof ClientEvents> extends Listener<T> {
	private matchRegex = /{user\.(mention|name|tag|discrim|position|createdat|joinedat)}|{guild(\.(splash|count))?}/g;

	public abstract override run(...args: T extends keyof ClientEvents ? ClientEvents[T] : unknown[]): Promise<unknown>;

	protected retriveAutomationContent(
		member: GuildMember,
		t: TFunction,
		message: string | null,
		embed: APIEmbed | null,
		defaultMsg: string
	): [APIEmbed[], string | undefined] {
		const embeds: APIEmbed[] = [];
		const parsedMessage = this.format(message || defaultMsg, member, t);
		const content = message ? parsedMessage : embed ? undefined : parsedMessage;

		if (embed) embeds.push(this.prepareEmbed(embed, member, t));

		return [embeds, content];
	}

	protected format(message: string, member: GuildMember, t: TFunction) {
		return message.replace(this.matchRegex, (match) => {
			switch (match.toLowerCase()) {
				case Matches.Mention:
					return member.toString();
				case Matches.Name:
					return member.displayName;
				case Matches.Discrim:
					return member.user.discriminator;
				case Matches.Guild:
					return member.guild.name;
				case Matches.Count:
					return t(LanguageKeys.Globals.NumberFormat, {
						value: member.guild.memberCount
					});
				case Matches.Position:
					return t(LanguageKeys.Globals.NumberOrdinal, {
						value: member.guild.memberCount
					});
				case Matches.CreatedAt:
					return t(LanguageKeys.Globals.FullDateTime, {
						date: member.user.createdAt
					});
				case Matches.JoinedAt:
					return t(LanguageKeys.Globals.FullDateTime, {
						date: member.joinedAt
					});
				default:
					return '';
			}
		});
	}

	private prepareEmbed(embedData: APIEmbed, member: GuildMember, t: TFunction): APIEmbed {
		const embed = new EmbedBuilder(embedData);

		embed.setColor(resolveClientColor(member.guild)).setThumbnail(member.displayAvatarURL());

		const embedResolved = embed.toJSON();

		if (embedResolved.description) embed.setDescription(this.format(embedResolved.description, member, t));

		if (embedResolved.title) embed.setTitle(this.format(embedResolved.title, member, t));

		if (embedResolved.footer?.text)
			embed.setFooter({
				text: this.format(embedResolved.footer.text, member, t),
				iconURL: embedResolved.footer.icon_url
			});

		const fields: APIEmbedField[] = [];
		if (embedResolved.fields) {
			for (const field of embedResolved.fields) {
				fields.push({
					name: this.format(field.name, member, t),
					value: this.format(field.value, member, t),
					inline: field.inline
				});
			}
		}

		embed.setFields(fields);

		return embed.toJSON();
	}
}

const enum Matches {
	Mention = '{user.mention}',
	Name = '{user.name}',
	Tag = '{user.tag}',
	Discrim = '{user.discrim}',
	Guild = '{guild}',
	Count = '{guild.count}',
	Position = '{user.position}',
	CreatedAt = '{user.createdat}',
	JoinedAt = '{user.joinedat}'
}

// eslint-disable-next-line no-redeclare
export namespace AutomationListener {
	export type Options = Listener.Options;
}

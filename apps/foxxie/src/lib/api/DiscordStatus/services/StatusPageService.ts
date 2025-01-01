import makeRequest from '@aero/http';
import { resolveToNull } from '@ruffpuff/utilities';
import { map } from '@sapphire/iterator-utilities/map';
import { container } from '@sapphire/pieces';
import { fetchT } from '@sapphire/plugin-i18next';
import { isNullish, toTitleCase } from '@sapphire/utilities';
import { FTFunction } from '#lib/types';
import { floatPromise, hours, minutes } from '#utils/common';
import { Colors, Urls } from '#utils/constants';
import { fetchChannel, resolveField } from '#utils/functions';
import { blue } from 'colorette';
import { EmbedBuilder, Guild, GuildTextBasedChannel, time, TimestampStyles } from 'discord.js';

import { StatusPage } from '../types.js';

export class StatusPageService {
	public static async RunGuilds() {
		const incidents = await StatusPageService.FetchIncidents();
		await container.logger.debug(`[${blue('Statuspage')}]: Attempting to run guild status pages.`);
		return [...map(container.client.guilds.cache.values(), (guild) => StatusPageService.RunGuild(guild, incidents))];
	}

	private static BuildEmbed(incident: StatusPage.Incident, _: FTFunction) {
		const color = StatusPageService.ResolveColor(incident.status, incident.impact);

		return new EmbedBuilder()
			.setColor(color)
			.setTimestamp(new Date(incident.started_at))
			.setURL(incident.shortlink)
			.setTitle(incident.name)
			.setAuthor({
				iconURL: container.client.user?.displayAvatarURL(),
				name: `Discord Status Update`
			})
			.addFields(
				incident.incident_updates.reverse().map((update) => {
					const timestamp = new Date(update.created_at);
					const duration = time(timestamp, TimestampStyles.RelativeTime);

					return resolveField(`${toTitleCase(update.status)} (${duration})`, update.body);
				})
			);
	}

	private static async FetchIncidents() {
		const result = await makeRequest(Urls.StatusPage).path('api').path('v2').path('incidents.json').json<StatusPage.Result>();
		return result.incidents;
	}

	private static async PatchUpdate(incident: StatusPage.Incident, guild: Guild, channel: GuildTextBasedChannel, messageId: string) {
		const embed = StatusPageService.BuildEmbed(incident, await fetchT(guild));

		const message = await resolveToNull(channel.messages.fetch(messageId));
		if (isNullish(message)) {
			void container.redis?.del(StatusPageService.ResolveGuildKey(guild.id, incident.id));
			return StatusPageService.PostUpdate(incident, guild, channel);
		}

		await floatPromise(message.edit({ embeds: [embed] }));
	}

	private static async PostUpdate(incident: StatusPage.Incident, guild: Guild, channel: GuildTextBasedChannel) {
		const embed = StatusPageService.BuildEmbed(incident, await fetchT(guild));

		const message = await resolveToNull(channel.send({ embeds: [embed] }));
		if (isNullish(message)) return;

		void container.redis?.pinsertex(StatusPageService.ResolveGuildKey(guild.id, incident.id), hours(36), message.id);
	}

	private static ResolveColor(status: StatusPage.Incident['status'], impact: StatusPage.Incident['impact']) {
		switch (status) {
			case 'identified':
			case 'investigating':
			case 'monitoring': {
				break;
			}
			case 'postmortem':
			case 'resolved':
				return Colors.Green;
		}

		switch (impact) {
			case 'critical':
				return Colors.Red;
			case 'major':
				return Colors.Orange;
			case 'minor':
				return Colors.Yellow;
			case 'none':
			default:
				return Colors.Blue;
		}
	}

	private static ResolveGuildKey(guildId: string, incidentId: string) {
		return `statuspage:${guildId}:${incidentId}`;
	}

	private static async RunGuild(guild: Guild, incidents: StatusPage.Incident[]) {
		const channel = await fetchChannel(guild, 'channelsLogsMessageDelete');
		if (!channel) return;

		for (const incident of incidents) {
			if (new Date(incident.created_at).getTime() + hours(36) <= Date.now()) continue;

			if (Date.now() - new Date(incident.updated_at!).getTime() > minutes(5)) continue;

			try {
				const resolved = (await container.redis?.get(StatusPageService.ResolveGuildKey(guild.id, incident.id))) || null;
				if (isNullish(resolved)) {
					await StatusPageService.PostUpdate(incident, guild, channel);
				} else {
					await StatusPageService.PatchUpdate(incident, guild, channel, resolved);
				}
			} catch {
				continue;
			}
		}
	}
}

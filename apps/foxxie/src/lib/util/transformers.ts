export function channelLink<G extends string, C extends string>(guildId: G, channelId: C): `https://discord.com/channels/${G}/${C}` {
	return `https://discord.com/channels/${guildId}/${channelId}`;
}

export function discordInviteLink<C extends string>(code: C): `https://discord.gg/${C}` {
	return `https://discord.gg/${code}`;
}

export function guildInvite<C extends string>(code: C): `https://discord.gg/${C}` {
	return `https://discord.gg/${code}`;
}

export function lastFmUserUrl<U extends string>(userName: U): `https://last.fm/user/${U}` {
	return `https://last.fm/user/${encodeURIComponent(userName) as U}`;
}

/**
 * Formats a message url link.
 * @param guildId The Guildid of the message
 * @param channelId The channelId of the message
 * @param messageId The id of the message
 * @returns string
 */
export function messageLink<G extends string, C extends string, M extends string>(
	guildId: G,
	channelId: C,
	messageId: M
): `https://discord.com/channels/${G}/${C}/${M}` {
	return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

export function userLink<I extends string>(userId: I): `https://discord.com/users/${I}` {
	return `https://discord.com/users/${userId}`;
}

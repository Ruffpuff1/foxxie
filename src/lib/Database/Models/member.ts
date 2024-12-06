import { member } from '@prisma/client';
import { container } from '@sapphire/framework';
import { Collection } from 'discord.js';

const cache = new Collection<string, MemberData>();

function memberCacheKey(userId: string, guildId: string) {
	return `${userId}_${guildId}`;
}

export async function acquireMember(userId: string, guildId: string): Promise<MemberData | null> {
	const cached = cache.get(memberCacheKey(userId, guildId));
	if (cached) return cached;

	const found = await container.prisma.member.findFirst({ where: { userId, guildId } });
	if (found) cache.set(memberCacheKey(userId, guildId), found);
	return found;
}

export async function ensureMember(userId: string, guildId: string): Promise<MemberData> {
	return (await acquireMember(userId, guildId)) ?? { userId, guildId, messageCount: 0 };
}

export async function updateMember(userId: string, guildId: string, data: Partial<MemberData> = {}) {
	const existing = await acquireMember(userId, guildId);
	if (existing) cache.set(memberCacheKey(userId, guildId), { ...existing, ...data });

	await container.prisma.member.update({
		where: {
			userId_guildId: {
				userId,
				guildId
			}
		},
		data
	});
}

export async function createMember(userId: string, guildId: string, data: Partial<MemberData> = {}) {
	const created = await container.prisma.member.create({ data: { userId, guildId, ...data } });
	cache.set(memberCacheKey(userId, guildId), created);
	return created;
}

export type MemberData = member;

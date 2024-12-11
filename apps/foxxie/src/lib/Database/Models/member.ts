import { member } from '@prisma/client';
import { container } from '@sapphire/framework';
import { Collection } from 'discord.js';

const cache = new Collection<string, MemberData>();

export type MemberData = member;

export async function acquireMember(userId: string, guildId: string): Promise<MemberData | null> {
	const cached = cache.get(memberCacheKey(userId, guildId));
	if (cached) return cached;

	const found = await container.prisma.member.findFirst({ where: { guildId, userId } });
	if (found) cache.set(memberCacheKey(userId, guildId), found);
	return found;
}

export async function createMember(userId: string, guildId: string, data: Partial<MemberData> = {}) {
	const created = await container.prisma.member.create({ data: { guildId, userId, ...data } });
	cache.set(memberCacheKey(userId, guildId), created);
	return created;
}

export async function ensureMember(userId: string, guildId: string): Promise<MemberData> {
	return (await acquireMember(userId, guildId)) ?? { guildId, messageCount: 0, userId };
}

export async function updateMember(userId: string, guildId: string, data: Partial<MemberData> = {}) {
	const existing = await acquireMember(userId, guildId);
	if (existing) cache.set(memberCacheKey(userId, guildId), { ...existing, ...data });

	await container.prisma.member.update({
		data,
		where: {
			userId_guildId: {
				guildId,
				userId
			}
		}
	});
}

function memberCacheKey(userId: string, guildId: string) {
	return `${userId}_${guildId}`;
}

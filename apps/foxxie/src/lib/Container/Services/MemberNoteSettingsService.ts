import { MemberNote } from '@prisma/client';
import { container } from '@sapphire/framework';
import { Note } from '#lib/database/Models/Discord/Member/Note';
import { Collection } from 'discord.js';

export class MemberNoteSettingsService {
	public cache = new Collection<number, Note>();

	public async fetchGuild(guildId: string): Promise<Note[]> {
		const notes = await container.prisma.memberNote.findMany({ where: { guildId } });
		return this.mapAndSet(notes);
	}

	public async fetchGuildMember(guildId: string, userId: string): Promise<Note[]> {
		const notes = await container.prisma.memberNote.findMany({ where: { guildId, userId } });
		return this.mapAndSet(notes);
	}

	public async findAll(): Promise<Note[]> {
		const notes = await container.prisma.memberNote.findMany();
		return this.mapAndSet(notes);
	}

	private mapAndSet(notes: MemberNote[]): Note[] {
		const created = notes.map((d) => new Note(d));
		created.forEach((c) => this.cache.set(c.id, c));
		return created;
	}
}

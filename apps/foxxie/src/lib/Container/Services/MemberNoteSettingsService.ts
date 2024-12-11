import { Note } from '#lib/Database/Models/Discord/Member/Note';
import { memberNote } from '@prisma/client';
import { container } from '@sapphire/framework';
import { Collection } from 'discord.js';

export class MemberNoteSettingsService {
	public cache = new Collection<number, Note>();

	public async findAll(): Promise<Note[]> {
		const notes = await container.prisma.memberNote.findMany();
		return this.mapAndSet(notes);
	}

	public async findById(id: number): Promise<Note | null> {
		const cached = this.cache.get(id);
		if (cached) return cached;

		const note = await container.prisma.memberNote.findFirst({ where: { id } });
		if (!note) return null;

		const created = new Note(note);
		this.cache.set(created.id, created);
		return created;
	}

	public async fetchGuild(guildId: string): Promise<Note[]> {
		const notes = await container.prisma.memberNote.findMany({ where: { guildId } });
		return this.mapAndSet(notes);
	}

	public async fetchGuildMember(guildId: string, userId: string): Promise<Note[]> {
		const notes = await container.prisma.memberNote.findMany({ where: { guildId, userId } });
		return this.mapAndSet(notes);
	}

	private mapAndSet(notes: memberNote[]): Note[] {
		const created = notes.map((d) => new Note(d));
		created.forEach((c) => this.cache.set(c.id, c));
		return created;
	}
}

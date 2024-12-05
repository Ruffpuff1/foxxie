import { Note } from '#lib/Database/Models/Discord/Member/Note';
import { Argument, ArgumentResult } from '@sapphire/framework';

export default class UserArgument extends Argument<Note> {
	public async run(parameter: string): Promise<ArgumentResult<Note>> {
		const number = parseInt(parameter, 10);
		if (isNaN(number)) return this.error({ parameter });

		const found = await this.container.settings.members.notes.findById(number);
		if (!found) return this.error({ parameter });

		return this.ok(found);
	}
}

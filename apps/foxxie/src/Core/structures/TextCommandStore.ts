import { AliasStore } from '@sapphire/pieces';

import { TextCommand } from './TextCommand.js';

export class TextCommandStore extends AliasStore<TextCommand, 'textcommands'> {
	public constructor() {
		super(TextCommand, { name: 'textcommands' });
	}

	public get categories(): string[] {
		const categories = new Set(this.map((command) => command.category));
		categories.delete(null);
		return [...categories] as string[];
	}
}

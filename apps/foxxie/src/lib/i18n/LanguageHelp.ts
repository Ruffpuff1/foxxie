export interface LanguageHelpDisplayOptions {
	examples?: (null | string)[];
	explainedUsage?: [string, string][];
	extendedHelp?: string | string[];
	possibleFormats?: [string, string][];
	reminder?: string;
	subcommands?: LanguageHelpDisplaySubcommandOptions[];
	usages?: string[];
}

export interface LanguageHelpDisplaySubcommandOptions {
	aliases?: string[];
	examples?: (null | string)[];
	explainedUsage?: [string, string][];
	extendedHelp?: string | string[];
	name: string;
	possibleFormats?: [string, string][];
	reminder?: string;
	usages?: string[];
}

export class LanguageHelp {
	private aliases: string = null!;
	private examples: string = null!;
	private explainedUsage: string = null!;
	private extendedHelp: string = null!;
	private possibleFormats: string = null!;
	private reminder: string = null!;
	private usages: string = null!;

	public display(name: string, aliases: null | string, options: LanguageHelpDisplayOptions, prefixUsed: string) {
		const { examples = [], explainedUsage = [], extendedHelp, possibleFormats = [], reminder, usages = [] } = options;
		const output: string[] = [];

		// Usages
		if (usages.length) {
			output.push(this.usages, ...usages.map((usage) => `→ ${prefixUsed}${name}${usage.length === 0 ? '' : ` *${usage}*`}`), '');
		}

		if (aliases !== null) {
			output.push(`${this.aliases}: ${aliases}`, '');
		}

		// Extended help
		if (extendedHelp) {
			output.push(this.extendedHelp, Array.isArray(extendedHelp) ? extendedHelp.join(' ') : extendedHelp, '');
		}

		// Explained usage
		if (explainedUsage.length) {
			output.push(this.explainedUsage, ...explainedUsage.map(([arg, desc]) => `→ **${arg}**: ${desc}`), '');
		}

		// Possible formats
		if (possibleFormats.length) {
			output.push(this.possibleFormats, ...possibleFormats.map(([type, example]) => `→ **${type}**: ${example}`), '');
		}

		// Examples
		if (examples.length) {
			output.push(this.examples, ...examples.map((example) => `→ ${prefixUsed}${name}${example ? ` *${example}*` : ''}`), '');
		} else {
			output.push(this.examples, `→ ${prefixUsed}${name}`, '');
		}

		// Reminder
		if (reminder) {
			output.push(this.reminder, reminder);
		}

		return output.join('\n');
	}

	public setAliases(text: string) {
		this.aliases = text;
		return this;
	}

	public setExamples(text: string) {
		this.examples = text;
		return this;
	}

	public setExplainedUsage(text: string) {
		this.explainedUsage = text;
		return this;
	}

	public setExtendedHelp(text: string) {
		this.extendedHelp = text;
		return this;
	}

	public setPossibleFormats(text: string) {
		this.possibleFormats = text;
		return this;
	}

	public setReminder(text: string) {
		this.reminder = text;
		return this;
	}

	public setUsages(text: string) {
		this.usages = text;
		return this;
	}
}

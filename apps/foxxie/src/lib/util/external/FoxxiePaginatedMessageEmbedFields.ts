import { PaginatedMessageEmbedFields, PaginatedMessagePage } from '@sapphire/discord.js-utilities';

export class FoxxiePaginatedMessageEmbedFields extends PaginatedMessageEmbedFields {
	public override addPage(page: PaginatedMessagePage): this {
		this.pages.push(page);
		return this;
	}
}

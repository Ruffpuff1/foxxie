import { LazyPaginatedMessage, MessageBuilder, PaginatedMessagePage } from '@sapphire/discord.js-utilities';
import { isFunction } from '@sapphire/utilities';

export class FoxxiePaginatedMessage extends LazyPaginatedMessage {
	public override addAsyncPageBuilder(builder: ((builder: MessageBuilder) => Promise<MessageBuilder>) | MessageBuilder) {
		return this.addPage(async () => (isFunction(builder) ? builder(new MessageBuilder()) : builder));
	}

	public override addPage(page: null | PaginatedMessagePage): this {
		if (!page) return this;
		this.pages.push(page);
		return this;
	}
}

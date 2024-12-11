import { Serializer } from '#lib/database';
import { AliasStore } from '@sapphire/framework';

export class SerializerStore extends AliasStore<Serializer<unknown>> {
	public constructor() {
		super(Serializer, { name: 'serializers' });
		this.container.client.stores.register(this);
	}
}

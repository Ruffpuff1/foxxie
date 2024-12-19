import { AliasStore } from '@sapphire/framework';
import { Serializer } from '#lib/database';

export class SerializerStore extends AliasStore<Serializer<unknown>> {
	public constructor() {
		super(Serializer, { name: 'serializers' });
		this.container.client.stores.register(this);
	}
}

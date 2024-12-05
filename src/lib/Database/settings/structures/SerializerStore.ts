import { AliasStore } from '@sapphire/framework';
import { Serializer } from '../../../Database/settings/structures/Serializer';

export class SerializerStore extends AliasStore<Serializer<unknown>> {
	public constructor() {
		super(Serializer, { name: 'serializers' });
		this.container.client.stores.register(this);
	}
}

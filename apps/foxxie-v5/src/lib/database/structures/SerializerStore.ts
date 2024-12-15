import { AliasStore } from '@sapphire/framework';
import { Serializer } from './Serializer';

export class SerializerStore extends AliasStore<Serializer<unknown>> {
    public constructor() {
        super(Serializer as any, { name: 'serializers' });
        this.container.client.stores.register(this);
    }
}

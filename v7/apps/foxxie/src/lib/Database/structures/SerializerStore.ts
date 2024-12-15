import { cast } from '@ruffpuff/utilities';
import { AliasStore } from '@sapphire/framework';
import { Serializer } from './Serializer';

export class SerializerStore extends AliasStore<Serializer<unknown>> {
    public constructor() {
        super(cast<any>(Serializer), { name: 'serializers' });
        this.container.client.stores.register(this);
    }
}

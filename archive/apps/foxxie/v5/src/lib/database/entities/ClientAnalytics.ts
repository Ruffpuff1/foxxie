import { Column } from 'typeorm';
import { kBigIntTransformer } from '../transformers';

export class ClientAnalytics {
    @Column('bigint', { default: 0, transformer: kBigIntTransformer })
    public messageCount = 0;

    @Column('bigint', { default: 0, transformer: kBigIntTransformer })
    public commandCount = 0;

    @Column('bigint', { default: 0, transformer: kBigIntTransformer })
    public songCount = 0;
}

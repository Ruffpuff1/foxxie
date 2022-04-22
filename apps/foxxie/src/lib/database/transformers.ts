import type { ValueTransformer } from 'typeorm';

export const kBigIntTransformer: ValueTransformer = {
    from: value => (value ? Number(value) : value),
    to: value => (value ? String(value) : value)
};

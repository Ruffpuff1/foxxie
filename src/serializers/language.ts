import { Serializer } from '#lib/database';
import type { Awaitable } from '@sapphire/utilities';
import i18next from 'i18next';

export class UserSerializer extends Serializer<string> {
    public async parse(args: Serializer.Args) {
        return this.result(args, await args.pickResult('language'));
    }

    public isValid(value: string): Awaitable<boolean> {
        return i18next.languages.includes(value);
    }
}

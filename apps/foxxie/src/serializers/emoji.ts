import { Serializer } from '#lib/database';
import type { EmojiObject } from '#lib/types';

export class UserSerializer extends Serializer<string> {
    public async parse(args: Serializer.Args) {
        const result = await args.pickResult('emoji');
        if (!result.success) return this.errorFromArgument(args, result.error);
        return this.ok(this.getEmojiString(result.value));
    }

    public isValid() {
        return true;
    }

    public stringify(data: string) {
        return data.includes('%') ? decodeURIComponent(data) : data;
    }

    private getEmojiString(value: EmojiObject): string {
        if (!value.id) return encodeURIComponent(value.name!);
        return `<${value.animated ? 'a' : ''}:${value.name}:${value.id}>`;
    }
}

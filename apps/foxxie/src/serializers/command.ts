import { Serializer } from '#lib/database';
import { ApplyOptions } from '@sapphire/decorators';
import type { FoxxieCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<Serializer.Options>({
    aliases: ['cmd', 'cmdmatch']
})
export class UserSerializer extends Serializer<string> {
    public async parse(args: Serializer.Args) {
        const picked = await args.pickResult('string');

        if (picked.success)
            return this.isValid(picked.value)
                ? this.ok(picked.value)
                : this.error(
                      args.t(LanguageKeys.Serializers.InvalidCommand, {
                          param: picked.value
                      })
                  );

        return this.error(args.t(picked.error.identifier));
    }

    public isValid(value: string): boolean {
        const [cate, cmd] = value.split('.');

        const validCategories = [...new Set(this.container.stores.get('commands').map(cmd => cmd.category!.toLowerCase()))];

        if (!cmd) {
            const justName = this.container.stores.get('commands').get(cate) as FoxxieCommand;
            if (!justName) return false;
            if (!justName.guarded) return true;
        }

        const command = this.container.stores.get('commands').get(cmd) as FoxxieCommand;

        if (cmd === '*') {
            if (!validCategories.includes(cate) || command && command.guarded) return false;
            return true;
        }

        if (command) {
            if (command.guarded) return false;
            if (validCategories.includes(command.category!.toLowerCase())) return true;
        }
        return false;
    }
}

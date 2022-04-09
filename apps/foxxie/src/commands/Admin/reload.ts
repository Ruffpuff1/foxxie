import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import type { Piece, Store } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { TFunction } from '@foxxie/i18n';
import { Stopwatch } from '@sapphire/stopwatch';
import type { Message } from 'discord.js';
import i18next from 'i18next';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['r'],
    description: LanguageKeys.Commands.Admin.ReloadDescription,
    detailedDescription: LanguageKeys.Commands.Admin.ReloadDetailedDescription,
    permissionLevel: PermissionLevels.BotOwner
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const content = await this.reloadAny(args);
        return send(msg, content);
    }

    private async reloadAny(args: FoxxieCommand.Args): Promise<string> {
        const language = await args.pickResult('language');
        if (language.success) return this.reloadLanguage(args.t, language.value);

        const store = await args.pickResult('store');
        if (store.success) return this.reloadStore(args.t, store.value);

        const piece = await args.pickResult('piece');
        if (piece.success) return this.reloadPiece(args.t, piece.value!);

        return this.reloadEverything(args.t);
    }

    private async reloadEverything(t: TFunction): Promise<string> {
        const timer = new Stopwatch();
        await Promise.all([i18next.reloadResources(i18next.languages), ...[...this.container.stores.map(store => store.loadAll())]]);

        return t(LanguageKeys.Commands.Admin.ReloadEverything, {
            time: timer.stop().toString()
        });
    }

    private async reloadPiece(t: TFunction, piece: Piece): Promise<string> {
        const timer = new Stopwatch();
        await piece.reload();
        const type = piece.store.name.slice(0, -1);

        return t(LanguageKeys.Commands.Admin.Reload, {
            type,
            name: piece.name,
            time: timer.stop().toString()
        });
    }

    private async reloadStore(t: TFunction, store: Store<Piece>): Promise<string> {
        const timer = new Stopwatch();
        await store.loadAll();

        return t(LanguageKeys.Commands.Admin.ReloadAll, {
            type: store.name,
            time: timer.stop().toString()
        });
    }

    private async reloadLanguage(t: TFunction, language: string): Promise<string> {
        const timer = new Stopwatch();
        await i18next.reloadResources(language);

        return t(LanguageKeys.Commands.Admin.ReloadLanguage, {
            time: timer.stop().toString(),
            language
        });
    }
}

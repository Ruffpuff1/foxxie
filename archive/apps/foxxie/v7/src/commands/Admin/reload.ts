import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage, PermissionLevels } from '#lib/Types';
import { sendLoadingMessage } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import type { Piece, Store } from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';
import i18next, { TFunction } from 'i18next';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['r'],
    description: LanguageKeys.Commands.Admin.ReloadDescription,
    // detailedDescription: LanguageKeys.Commands.Admin.ReloadDetailedDescription,
    permissionLevel: PermissionLevels.BotOwner
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const loading = await sendLoadingMessage(msg);
        const content = await this.reloadAny(args);
        await loading.edit(content);
    }

    private async reloadAny(args: FoxxieCommand.Args): Promise<string> {
        const language = await args.pickResult('language');
        if (language.isOk()) return this.reloadLanguage(args.t, language.unwrap());

        const store = await args.pickResult('store');
        if (store.isOk()) return this.reloadStore(args.t, store.unwrap());

        const piece = await args.pickResult('piece');
        if (piece.isOk()) return this.reloadPiece(args.t, piece.unwrap());

        return this.reloadEverything(args.t);
    }

    private async reloadEverything(t: TFunction): Promise<string> {
        const timer = new Stopwatch();
        await Promise.all([
            i18next.reloadResources([...i18next.languages.values()]),
            ...[...this.container.stores.map(store => store.loadAll())]
        ]);

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

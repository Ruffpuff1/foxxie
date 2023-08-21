import type { HelpDisplayData } from '#lib/types';
import { FT, T } from '@foxxie/i18n';

export const EvalConsole = FT<{ name: string; footer: string; time: string }>('commands/admin:evalConsole');
export const EvalDescription = T('commands/admin:evalDescription');
export const EvalError = FT<{ output: string; type: string; time: string }>('commands/admin:evalError');
export const EvalHaste = FT<{ output: string; footer: string; time: string }>('commands/admin:evalHaste');
export const EvalOutput = FT<{ output: string; footer: string; time: string }>('commands/admin:evalOutput');
export const Reload = FT<{ type: string; name: string; time: string }>('commands/admin:reload');
export const ReloadAll = FT<{ type: string; time: string }>('commands/admin:reloadAll');
export const ReloadDescription = T('commands/admin:reloadDescription');
export const ReloadDetailedDescription = T<HelpDisplayData>('commands/admin:reloadDetailedDescription');
export const ReloadEverything = FT<{ time: string }>('commands/admin:reloadEverything');
export const ReloadLanguage = FT<{ language: string; time: string }>('commands/admin:reloadLanguage');
export const ServerlistDescription = T('commands/admin:serverlistDescription');
export const ServerlistDetailedDescription = T<HelpDisplayData>('commands/admin:serverlistDetailedDescription');
export const ServerlistFooter = FT<{ count: number }>('commands/admin:serverlistFooter');
export const ServerlistMembers = T('commands/admin:serverlistMembers');
export const ServerlistTitle = FT<{ name: string }>('commands/admin:serverlistTitle');

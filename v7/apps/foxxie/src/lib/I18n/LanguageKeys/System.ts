import { FT, T } from '#lib/Types';

export const CommandCancel = T('system:commandCancel');
export const DmWarn = T('system:dmWarn');
export const FetchBansFail = T('system:fetchBansFail');
export const Footer = T('system:footer');
export const MessageLoading = T<string[]>('system:messageLoading');
export const PrefixReminder = FT<{ prefixes: string[] }>('system:prefixReminder');
export const QueryFail = T('system:queryFail');

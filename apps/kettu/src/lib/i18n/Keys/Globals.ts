import { FT, T } from '@foxxie/i18n';

export const And = FT<{ value: any[] }>('globals:and');
export const By = T('globals:by');
export const CodeAnd = FT<{ value: any[] }>('globals:codeand');
export const DateFormat = FT<{ value: Date | number | string }>('globals:dateFormat');
export const Duration = FT<{ value: Date | number | string }>('globals:duration');
export const In = T('globals:in');
export const No = T('globals:no');
export const None = T('globals:none');
export const Number = FT<{ value: string | number }, string>('globals:number');
export const Yes = T('globals:yes');

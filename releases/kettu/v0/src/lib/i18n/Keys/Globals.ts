import { FT, T } from '#types/Utils';

export const And = FT<{ value: any[] }>('globals:and');
export const CodeAnd = FT<{ value: any[] }>('globals:codeand');
export const DateFormat = FT<{ value: Date | number | string }>('globals:dateFormat');
export const Duration = FT<{ value: Date | number | string }>('globals:duration');
export const No = T('globals:no');
export const None = T('globals:none');
export const Number = FT<{ value: string | number }>('globals:number');
export const Yes = T('globals:yes');

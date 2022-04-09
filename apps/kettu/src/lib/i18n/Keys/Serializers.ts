import { FT } from '@foxxie/i18n';

export const MinMaxBothExclusive = FT<{
    name: string;
    min: number;
    max: number;
}>('serializers:minMaxBothExclusive');
export const MinMaxBothInclusive = FT<{
    name: string;
    min: number;
    max: number;
}>('serializers:minMaxBothInclusive');
export const MinMaxExactlyExclusive = FT<{ name: string; min: number }>('serializers:minMaxExactlyExclusive');
export const MinMaxExactlyInclusive = FT<{ name: string; min: number }>('serializers:minMaxExactlyInclusive');
export const MinMaxMaxExclusive = FT<{ name: string; max: number }>('serializers:minMaxMaxExclusive');
export const MinMaxMaxInclusive = FT<{ name: string; max: number }>('serializers:minMaxMaxInclusive');
export const MinMaxMinExclusive = FT<{ name: string; min: number }>('serializers:minMaxMinExclusive');
export const MinMaxMinInclusive = FT<{ name: string; min: number }>('serializers:minMaxMinInclusive');

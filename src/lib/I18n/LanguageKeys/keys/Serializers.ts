import { FT, T } from '#lib/types';

export const InvalidCommand = FT<{ param: string }>('serializers:invalidCommand');
export const InvalidRole = FT<{ name: string }>('serializers:invalidRole');
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
export const PermissionNodeDuplicatedCommand = FT<{ command: string }, string>('serializers:permissionNodeDuplicatedCommand');
export const UnknownChannel = T('serializers:unknownChannel');
export const UnknownRole = T('serializers:unknownRole');

import { FT } from '#lib/types';

export const InvalidCommand = FT<{ name: string; param: string }>('serializers:invalidCommand');
export const InvalidFloat = FT<{ name: string; value: number }>('serializers:invalidFloat');
export const InvalidInt = FT<{ name: string; value: number }>('serializers:invalidInt');
export const InvalidRole = FT<{ name: string }>('serializers:invalidRole');
export const MinMaxBothExclusive = FT<{
	max: number;
	min: number;
	name: string;
}>('serializers:minMaxBothExclusive');
export const MinMaxBothInclusive = FT<{
	max: number;
	min: number;
	name: string;
}>('serializers:minMaxBothInclusive');
export const MinMaxExactlyExclusive = FT<{ min: number; name: string }>('serializers:minMaxExactlyExclusive');
export const MinMaxExactlyInclusive = FT<{ min: number; name: string }>('serializers:minMaxExactlyInclusive');
export const MinMaxMaxExclusive = FT<{ max: number; name: string }>('serializers:minMaxMaxExclusive');
export const MinMaxMaxInclusive = FT<{ max: number; name: string }>('serializers:minMaxMaxInclusive');
export const MinMaxMinExclusive = FT<{ min: number; name: string }>('serializers:minMaxMinExclusive');
export const MinMaxMinInclusive = FT<{ min: number; name: string }>('serializers:minMaxMinInclusive');
export const PermissionNodeDuplicatedCommand = FT<{ command: string }, string>('serializers:permissionNodeDuplicatedCommand');

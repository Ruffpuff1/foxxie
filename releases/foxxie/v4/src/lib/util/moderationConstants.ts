import { Colors } from './constants';

export const enum TypeBits {
    Variation = 0b00001111, // 15
    Metadata = 0b11110000 // 240
}

export const TypeVariation = {
    Ban: 0b00000000, // 0
    Kick: 0b00000001, // 1
    Mute: 0b00000010, // 2
    Prune: 0b00000011, // 3
    SoftBan: 0b00000100, // 4
    Warning: 0b00000101, // 5
    Dehoist: 0b00000110, // 6
    Lock: 0b00000111, // 7
    GlobalBan: 0b00001000, // 8
    RaidBan: 0b00001001, // 9
    Blacklisted: 0b00001010, // 10
    SetNickname: 0b00001011 // 11
};

export const TypeMetadata = {
    Appeal: 0b01100100, // 100
    Temporary: 0b11001000, // 200
    Fast: 0b100101100, // 300
    Invalidated: 0b110010000 // 400
};

export const TypeCodes = {
    // normal
    Ban: TypeVariation.Ban, // 0
    Kick: TypeVariation.Kick, // 1
    Mute: TypeVariation.Mute, // 2
    Prune: TypeVariation.Prune, // 3
    SoftBan: TypeVariation.SoftBan, // 4
    Warning: TypeVariation.Warning, // 5
    Dehoist: TypeVariation.Dehoist, // 6
    Lock: TypeVariation.Lock, // 7
    GlobalBan: TypeVariation.GlobalBan, // 8
    RaidBan: TypeVariation.RaidBan, // 9
    Blacklisted: TypeVariation.Blacklisted, // 10
    SetNickname: TypeVariation.SetNickname, // 11

    // removed
    UnBan: TypeVariation.Ban | TypeMetadata.Appeal, // 100
    UnMute: TypeVariation.Mute | TypeMetadata.Appeal, // 102
    UnWarn: TypeVariation.Warning | TypeMetadata.Appeal, // 101
    UnLock: TypeVariation.Lock | TypeMetadata.Appeal, // 103
    UnNickname: TypeVariation.SetNickname | TypeMetadata.Appeal, // 111

    // temp
    TemporaryBan: TypeVariation.Ban | TypeMetadata.Temporary, // 200
    TemporaryMute: TypeVariation.Mute | TypeMetadata.Temporary, // 202
    TemporaryNickname: TypeVariation.SetNickname | TypeMetadata.Temporary, // 203

    // fast
    FastTemporaryBan: TypeVariation.Ban | TypeMetadata.Temporary | TypeMetadata.Fast, // 492
    FastTemporaryMute: TypeVariation.Mute | TypeMetadata.Temporary | TypeMetadata.Fast, // 494
    FastTemporaryNickname: TypeVariation.SetNickname | TypeMetadata.Temporary | TypeMetadata.Fast // 495
};

export const metadata = new Map([
    [TypeCodes.Warning, { color: Colors.Yellow, title: 'warn' }],
    [TypeCodes.Mute, { color: Colors.Orange, title: 'mute' }],
    [TypeCodes.Kick, { color: Colors.Orange, title: 'kick' }],
    [TypeCodes.SoftBan, { color: Colors.Red, title: 'softBan' }],
    [TypeCodes.Ban, { color: Colors.Red, title: 'ban' }],
    [TypeCodes.GlobalBan, { color: Colors.Red, title: 'globalBan' }],
    [TypeCodes.RaidBan, { color: Colors.Red, title: 'raidBan' }],
    [TypeCodes.Blacklisted, { color: Colors.Red, title: 'blacklist' }],
    [TypeCodes.SetNickname, { color: Colors.Yellow, title: 'nickname' }],

    [TypeCodes.UnWarn, { color: Colors.Green, title: 'unwarn' }],
    [TypeCodes.UnMute, { color: Colors.Green, title: 'unmute' }],
    [TypeCodes.UnBan, { color: Colors.Green, title: 'unban' }],
    [TypeCodes.UnNickname, { color: Colors.Green, title: 'unnickname' }],

    [TypeCodes.TemporaryMute, { color: Colors.Orange, title: 'tempMute' }],
    [TypeCodes.TemporaryBan, { color: Colors.Red, title: 'tempBan' }],
    [TypeCodes.TemporaryNickname, { color: Colors.Yellow, title: 'tempNickname' }],

    [TypeCodes.FastTemporaryMute, { color: Colors.Orange, title: 'tempMute' }],
    [TypeCodes.FastTemporaryBan, { color: Colors.Red, title: 'tempBan' }],
    [TypeCodes.FastTemporaryNickname, { color: Colors.Yellow, title: 'tempNickname' }],

    [TypeCodes.Prune, { color: Colors.Yellow, title: 'purge' }],
    [TypeCodes.Dehoist, { color: Colors.Yellow, title: 'dehoist' }],
    [TypeCodes.Lock, { color: Colors.Orange, title: 'lock' }],
    [TypeCodes.UnLock, { color: Colors.Green, title: 'unlock' }]
]);

export const TypeVariationAppealNames = {
    Nickname: 'endTempnick',
    Mute: 'endTempmute',
    Ban: 'endTempban'
};

export interface ModerationTypeAssets {
	color: number;
	title: string;
}

export interface ModerationManagerDescriptionData {
	type: string;
	userName: string;
	userDiscriminator: string;
    duration: number | null;
	userId: string;
	reason: string | null;
	prefix: string;
	caseId: number;
	formattedDuration: string;
}
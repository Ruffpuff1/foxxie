import { FT, T } from '../../../types';

export const automationNoInput = FT<{ possibles: string[] }, string>('commands/settings:automationNoInput');

export const birthdayChannelNone = T('commands/settings:birthdayChannelNone');
export const birthdayChannelNow = FT<{ channel: string }, string>('commands/settings:birthdayChannelNow');
export const birthdayChannelReset = T('commands/settings:birthdayChannelReset');
export const birthdayChannelSet = FT<{ channel: string }, string>('commands/settings:birthdayChannelSet');
export const birthdayDescription = T('commands/settings:birthdayDescription');
export const birthdayExtendedUsage = T<string[]>('commands/settings:birthdayExtendedUsage');
export const birthdayListNone = T('commands/settings:birthdayListNone');
export const birthdayListTitle = FT<{ guild: string, count: number }, string>('commands/settings:birthdayListTitle');
export const birthdayMessageNone = T('commands/settings:birthdayMessageNone');
export const birthdayMessageNow = FT<{ message: string }, string>('commands/settings:birthdayMessageNow');
export const birthdayMessageReset = T('commands/settings:birthdayMessageReset');
export const birthdayMessageSet = FT<{ message: string }, string>('commands/settings:birthdayMessageSet');
export const birthdayNone = T('commands/settings:birthdayNone');
export const birthdayResetSuccess = T('commands/settings:birthdayResetSuccess');

export const birthdayRoleNone = T('commands/settings:birthdayRoleNone');
export const birthdayRoleNow = FT<{ role: string }, string>('commands/settings:birthdayRoleNow');
export const birthdayRoleReset = T('commands/settings:birthdayRole');
export const birthdayRoleSet = FT<{ role: string }, string>('commands/settings:birthdayRoleSet');

export const birthdaySetSuccess = FT<{ birthday: Date }, string>('commands/settings:birthdaySetSuccess');
export const birthdayView = FT<{ birthday: Date }, string>('commands/settings:birthdayView');

export const highlightAddError = T('commands/settings:highlightAddError');
export const highlightAddRegexError = FT<{ error: string }, string>('commands/settings:highlightAddRegexError');
export const highlightAddRegexNone = T('commands/settings:highlightAddRegexNone');
export const highlightAddRegexSuccess = FT<{ regex: string }, string>('commands/settings:highlightAddRegexSuccess');
export const highlightAddWordNone = T('commands/settings:highlightAddWordNone');
export const highlightAddWordSuccess = FT<{ word: string }, string>('commands/settings:highlightAddWordSuccess');
export const highlightDescription = T('commands/settings:highlightDescription');
export const highlightExtendedUsage = T<string[]>('commands/settings:highlightExtendedUsage');
export const highlightNone = T('commands/settings:highlightNone');
export const highlightRemoveNoExist = T('commands/settings:highlightRemoveNoExist');
export const highlightRemoveSuccess = FT<{ word: string }, string>('commands/settings:highlightRemoveSuccess');
export const highlightTitles = T<{
    regexes: string;
    words: string;
}>('commands/settings:highlightTitles');

export const prefixDescription = FT<{ defaultPrefix: string }, string>('commands/settings:prefixDescription');
export const prefixDetailedDescription = T('commands/settings:prefixDetailedDescription');
export const prefixNow = FT<{ prefix: string }, string>('commands/settings:prefixNow');
export const prefixSet = FT<{ prefix: string }, string>('commands/settings:prefixSet');

export const reactionroleAddExists = T('commands/settings:reactionroleAddExists');
export const reactionroleAddInvalidEmoji = T('commands/settings:reactionroleAddInvalidEmoji');
export const reactionroleAddNoReaction = T('commands/settings:reactionroleAddNoReaction');
export const reactionroleAddQuery = T('commands/settings:reactionroleAddQuery');
export const reactionroleAddSuccess = FT<{ role: string }, string>('commands/settings:reactionroleAddSuccess');
export const reactionroleDescription = T('commands/settings:reactionroleDescription');
export const reactionroleExtendedUsage = T<string[]>('commands/settings:reactionroleExtendedUsage');
export const reactionroleListNone = T('commands/settings:reactionroleListNone');
export const reactionroleRemoveNoExist = T('commands/settings:reactionroleRemoveNoExist');
export const reactionroleRemoveSuccess = FT<{ role: string }, string>('commands/settings:reactionroleRemoveSuccess');

export const tagAddExists = FT<{ tag: string }>('commands/settings:tagAddExists');
export const tagAddNoPerms = FT<{ permission: string }, string>('commands/settings:tagAddNoPerms');
export const tagAddSuccess = FT<{ tag: string, content: string }, string>('commands/settings:tagAddSuccess');
export const tagDescription = T('commands/settings:tagDescription');
export const tagExtendedUsage = T<string[]>('commands/settings:tagExtendedUsage');
export const tagListFooter = T('commands/settings:tagListFooter');
export const tagRemoveNoExist = FT<{ tag: string }, string>('commands/settings:tagRemoveNoExist');
export const tagRemoveNoPerms = FT<{ permission: string }, string>('commands/settings:tagRemoveNoPerms');
export const tagRemoveSuccess = FT<{ tag: string }, string>('commands/settings:tagRemoveSuccess');

export const welcomeChannelNoSet = T('commands/settings:welcomeChannelNoSet');
export const welcomeChannelReset = T('commands/settings:welcomeChannelReset');
export const welcomeChannelSet = FT<{ channel: string }>('commands/settings:welcomeChannelSet');
export const welcomeChannelUpdate = FT<{ channel: string }>('commands/settings:welcomeChannelUpdate');
export const welcomeDescription = T('commands/settings:welcomeDescription');
export const welcomeEmbedNoSet = T('commands/settings:welcomeEmbedNoSet');
export const welcomeEmbedReset = T('commands/settings:welcomeChannelReset');
export const welcomeEmbedSet = T('commands/settings:welcomeEmbedSet');
export const welcomeEmbedUpdate = T('commands/settings:welcomeEmbedUpdate');
export const welcomeExtendedUsage = T<string[]>('commands/settings:welcomeExtendedUsage');
export const welcomeMessageNoSet = T('commands/settings:welcomeMessageNoSet');
export const welcomeMessageReset = T('commands/settings:welcomeMessageReset');
export const welcomeMessageSet = FT<{ message: string }, string>('commands/settings:welcomeMessageSet');
export const welcomeMessageUpdate = FT<{ message: string }, string>('commands/settings:welcomeMessageUpdate');
export const welcomeShow = FT<{
    message: string;
    channel: string;
    embed: string;
    timeout: string;
}>('commands/settings:welcomeShow');
import { FT, T } from '#lib/types';

export const Name = T('commands/moderation/utilities/case:name');
export const Description = T('commands/moderation/utilities/case:description');
export const Edit = T('commands/moderation/utilities/case:edit');
export const View = T('commands/moderation/utilities/case:view');
export const List = T('commands/moderation/utilities/case:list');
export const OptionsCase = T('commands/moderation/utilities/case:optionsCase');
export const OptionsDuration = 'commands/moderation/utilities/case:optionsDuration';
export const OptionsModerator = T('commands/moderation/utilities/case:optionsModerator');
export const OptionsOverview = T('commands/moderation/utilities/case:optionsOverview');
export const OptionsPendingOnly = T('commands/moderation/utilities/case:optionsPendingOnly');
export const OptionsReason = 'commands/moderation/utilities/case:optionsReason';
export const OptionsRefrence = 'commands/moderation/utilities/case:optionsRefrence';
export const OptionsShow = T('commands/moderation/utilities/case:optionsShow');
export const OptionsType = T('commands/moderation/utilities/case:optionsType');
export const OptionsUser = T('commands/moderation/utilities/case:optionsUser');
export const TimeNotAllowed = FT<{ type: string }>('commands/moderation/utilities/case:timeNotAllowed');
export const TimeNotAllowedInCompletedEntries = FT<{ caseId: number }>('commands/moderation/utilities/case:timeNotAllowedInCompletedEntries');
export const TimeEditNotSupported = FT<{ type: string }>('commands/moderation/utilities/case:timeEditNotSupported');
export const TimeTooEarly = FT<{ time: string }>('commands/moderation/utilities/case:timeTooEarly');
export const ListEmpty = T('commands/moderation/utilities/case:listEmpty');
export const ListDetailsTitle = FT<{ count: number }>('commands/moderation/utilities/case:listDetailsTitle');
export const ListDetailsModerator = FT<{ emoji: string; mention: string; userId: string }>('commands/moderation/utilities/case:listDetailsModerator');
export const ListDetailsUser = FT<{ emoji: string; mention: string; userId: string }>('commands/moderation/utilities/case:listDetailsUser');
export const ListDetailsExpired = FT<{ emoji: string; time: string }>('commands/moderation/utilities/case:listDetailsExpired');
export const ListDetailsExpires = FT<{ emoji: string; time: string }>('commands/moderation/utilities/case:listDetailsExpires');
export const ListDetailsFooterByModerator = FT<{ moderator: string }>('commands/moderation/utilities/case:listDetailsFooterByModerator');
export const ListDetailsFooterOfType = FT<{ type: string }>('commands/moderation/utilities/case:listDetailsFooterOfType');
export const ListDetailsFooterOfUser = FT<{ user: string }>('commands/moderation/utilities/case:listDetailsFooterOfUser');
export const ListDetailsFooterCases = FT<{ cases?: string; context?: 'noFilter'; guild: string }>(
	'commands/moderation/utilities/case:listDetailsFooterCases'
);
export const ListDetailsFooterPendingCases = FT<{ cases?: string; context?: 'noFilter'; guild: string }>(
	'commands/moderation/utilities/case:listDetailsFooterPendingCases'
);
export const ListDetailsLocation = FT<{ channel: string; emoji: string; id: string }>('commands/moderation/utilities/case:listDetailsLocation');
export const ListOverviewFooter = FT<ListOverview>('commands/moderation/utilities/case:listOverviewFooter');
export const ListOverviewFooterUser = FT<ListOverview>('commands/moderation/utilities/case:listOverviewFooterUser');
export const ListOverviewFooterWarning = FT<{ count: number }>('commands/moderation/utilities/case:listOverviewFooterWarning');
export const ListOverviewFooterMutes = FT<{ count: number }>('commands/moderation/utilities/case:listOverviewFooterMutes');
export const ListOverviewFooterTimeouts = FT<{ count: number }>('commands/moderation/utilities/case:listOverviewFooterTimeouts');
export const ListOverviewFooterKicks = FT<{ count: number }>('commands/moderation/utilities/case:listOverviewFooterKicks');
export const ListOverviewFooterBans = FT<{ count: number }>('commands/moderation/utilities/case:listOverviewFooterBans');
export const EditSuccess = FT<{ caseId: number }>('commands/moderation/utilities/case:editSuccess');
export const ArchiveSuccess = FT<{ caseId: number }>('commands/moderation/utilities/case:archiveSuccess');
export const DeleteSuccess = FT<{ caseId: number }>('commands/moderation/utilities/case:deleteSuccess');

interface ListOverview {
	bans: string;
	kicks: string;
	mutes: string;
	timeouts: string;
	warnings: string;
}

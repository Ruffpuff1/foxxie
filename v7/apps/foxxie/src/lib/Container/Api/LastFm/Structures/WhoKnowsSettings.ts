import { WhoKnowsMode } from '../Enums/WhoKnowsMode';

export class WhoKnowsSettings {
    public hidePrivateUsers: boolean;

    public showBotters: boolean;

    public adminView: boolean;

    public newSearchValue: string;

    public whoKnowsMode: WhoKnowsMode;

    public displayRoleFilter: boolean;

    public redirectsEnabled: boolean;

    public constructor(data: Partial<WhoKnowsSettings>) {
        Object.assign(this, data);
    }
}

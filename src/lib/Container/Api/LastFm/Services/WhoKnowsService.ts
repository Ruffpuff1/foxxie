import { bold, hyperlink } from 'discord.js';
import _ from 'lodash';
import { WhoKnowsObjectWithUser } from '../Structures/WhoKnowsObjectWithUser';

export class WhoKnowsService {
    public static WhoKnowsListToString(whoKnowsObjects: WhoKnowsObjectWithUser[], requestedUserId: string, __ = false) {
        let reply = '';

        let whoKnowsCount = whoKnowsObjects.length;
        if (whoKnowsCount > 14) {
            whoKnowsCount = 14;
        }

        const usersToShow = _.orderBy(whoKnowsObjects, o => o.playcount, 'desc');

        const spacer = '';

        let indexNumber = 1;
        let timesNameAdded = 0;
        let requestedUserAdded = false;
        const addedUsers: string[] = [];

        for (let index = 0; timesNameAdded < whoKnowsCount; index++) {
            if (index >= usersToShow.length) break;

            const user = usersToShow[index];

            if (addedUsers.some(a => a === user.userId)) continue;

            let nameWithLink: string;

            nameWithLink = hyperlink(user.discordName, `https://last.fm/user/${user.lastFmUsername}`);
            if (user.userId === requestedUserId) {
                nameWithLink = bold(nameWithLink);
            }

            const playString = `plays`;

            let positionCounter = `${spacer}${indexNumber}.`;
            positionCounter =
                user.userId === requestedUserId
                    ? user.sameServer
                        ? `__**${positionCounter}** __`
                        : `**${positionCounter}** `
                    : user.sameServer
                      ? `__${positionCounter}__ `
                      : `${positionCounter} `;

            const afterPositionSpacer = index + 1 === 10 ? '' : index + 1 === 7 || index + 1 === 9 ? ' ' : ' ';

            reply += `${positionCounter}${afterPositionSpacer}${nameWithLink}`;
            reply += ` - ${bold(user.playcount.toLocaleString())} ${playString}\n`;

            indexNumber += 1;
            timesNameAdded += 1;

            addedUsers.push(user.userId);

            if (user.userId === requestedUserId) {
                requestedUserAdded = true;
            }
        }

        if (!requestedUserAdded) {
            const requestedUser = whoKnowsObjects.find(f => f.userId === requestedUserId);
            if (requestedUser) {
                const nameWithLink = hyperlink(requestedUser.discordName, `https://last.fm/user/${requestedUser.lastFmUsername}`);
                const playString = `plays`;

                reply += `${bold(spacer)}${whoKnowsObjects.indexOf(requestedUser) + 1}.  ${nameWithLink}** `;
                reply += ` - ${bold(requestedUser.playcount.toLocaleString())} ${playString}\n`;
            }
        }

        return reply;
    }
}

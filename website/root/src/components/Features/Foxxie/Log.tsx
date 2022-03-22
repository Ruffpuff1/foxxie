import { seconds, years } from "@ruffpuff/utilities";
import { DiscordMessage, DiscordEmbedDescription, DiscordMessages, DiscordEmbed, DiscordEmbedFooter } from "@skyra/discord-components-react";

export function Log() {
    const created = new Date('2018-09-04T04:44:20.911Z');
    const joined = new Date('2020-10-02T08:59:47.563Z');
    const now = Date.now();
    const createdFormatted = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(created);
    const durationFromCreated = (now - created.getTime()) / years(1);

    return (
        <DiscordMessages>
            <DiscordMessage
                author='Foxxie'
                bot
                avatar="https://cdn.ruffpuff.dev/foxxie.png"
            >

                <DiscordEmbed authorName="Member Joined" authorImage="https://cdn.ruffpuff.dev/ruffpuff.jpg" color="#5DBA7E" slot='embeds' >
                    <DiscordEmbedDescription slot='description'>
                        <strong>User</strong>: <code>Ruffpuff#0017</code> (486396074282450946)<br />
                        <strong>Created</strong>: {createdFormatted} ({Math.round(durationFromCreated)} years ago)<br />
                        <strong>Position</strong>: 1st
                    </DiscordEmbedDescription>
                    <DiscordEmbedFooter timestamp={joined} slot='footer' />
                </DiscordEmbed>{' '}
                <DiscordEmbed authorName="Member Passed Screening" authorImage="https://cdn.ruffpuff.dev/ruffpuff.jpg" color="#FFDC5C" slot='embeds' >
                    <DiscordEmbedDescription slot='description'>
                        <strong>User</strong>: <code>Ruffpuff#0017</code> (486396074282450946)<br />
                        <strong>Time</strong>: 17 seconds
                    </DiscordEmbedDescription>
                    <DiscordEmbedFooter timestamp={new Date(joined.getTime() + seconds(17))} slot='footer' />
                </DiscordEmbed>
            </DiscordMessage>
        </DiscordMessages>
    );
}

import { years } from "@ruffpuff/utilities";
import { DiscordCommand, DiscordMessage, DiscordMessages, DiscordEmbed, DiscordEmbedField, DiscordEmbedFields, DiscordActionRow, DiscordButton, DiscordAttachments } from "@skyra/discord-components-react";

export function InfoUser() {
    const created = new Date('2018-09-04T04:44:20.911Z');
    const joined = new Date('2020-10-02T08:59:47.563Z');
    const now = Date.now();

    const durationFromCreated = (now - created.getTime()) / years(1);
    const durationFromJoin = (now - joined.getTime()) / years(1);

    const createdFormatted = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(created);

    return (
        <DiscordMessages>
            <DiscordMessage
                author='Foxxie'
                bot
                avatar="https://cdn.ruffpuff.dev/foxxie.png"
            >
                <DiscordCommand
                    slot="reply"
                    command='/info'
                    avatar="https://cdn.ruffpuff.dev/ruffpuff.jpg"
                    author="Ruffpuff"
                    roleColor="#898489"
                ></ DiscordCommand>
                <DiscordEmbed
                    slot='embeds'
                    authorName="Ruffpuff#0017 [486396074282450946] (he/they)"
                    thumbnail="https://cdn.ruffpuff.dev/ruffpuff.jpg"
                    authorImage="https://cdn.ruffpuff.dev/ruffpuff.jpg"
                    color="#898489"
                >
                    <DiscordEmbedFields slot='fields'>
                        <DiscordEmbedField fieldTitle='📝 About'>
                            <p>Joined Discord on {createdFormatted} ({Math.round(durationFromCreated)} years ago)</p>
                            <p>Created The Corner Store on October 2, 2020 ({Math.round(durationFromJoin)} year ago)</p>
                            <p>106.73K messages sent.</p>
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='📜 Roles (14)'>
                            <p>Ruff, Moderator, Server Boosters</p>
                            <p>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</p>
                            <p>Senior Customers, Active, Patrons, Regulars, Returnings, New Customer, Old Timers</p>
                            <p>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</p>
                            <p>He/Him, They/Them</p>
                        </DiscordEmbedField>
                    </DiscordEmbedFields>
                </DiscordEmbed>
                <DiscordAttachments
                    slot='components'
                >
                    <DiscordActionRow>
                        <DiscordButton type="primary" emojiName="arrowleft" emoji="https://cdn.ruffpuff.dev/emojiArrowLeft.svg" />
                        <DiscordButton type='destructive' emojiName="stop" emoji="https://cdn.ruffpuff.dev/emojiStop.svg" />
                        <DiscordButton type="primary" emojiName="arrowRight" emoji="https://cdn.ruffpuff.dev/emojiArrowRight.svg" />
                    </DiscordActionRow>
                </DiscordAttachments>
            </DiscordMessage>
        </DiscordMessages>
    );
}

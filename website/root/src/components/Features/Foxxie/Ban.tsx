import { DiscordCommand, DiscordMessage, DiscordMessages, DiscordCustomEmoji } from "@skyra/discord-components-react";

export function Ban() {
    return (
        <DiscordMessages>
            <DiscordMessage
               author='Foxxie'
               bot
               avatar="https://cdn.ruffpuff.dev/foxxie.png"
            >
                <DiscordCommand
                    slot="reply"
                    command='/ban'
                    avatar="https://cdn.ruffpuff.dev/ruffpuff.jpg"
                    author="Ruffpuff"
                    roleColor="#898489"
                ></ DiscordCommand>
                <DiscordCustomEmoji
                    name='sucess'
                    url="https://cdn.ruffpuff.dev/emojiCheck.png"
                /> Successfully banned Cyrus#9319, created case #241 → `No Reason Specified`
            </DiscordMessage>
        </DiscordMessages>
    )
}

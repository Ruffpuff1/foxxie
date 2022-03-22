import { DiscordCommand, DiscordMessage, DiscordMessages, DiscordCustomEmoji } from "@skyra/discord-components-react";
import Link from "next/link";

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
                /> Successfully banned <strong>Cyrus#9319</strong>, created case <Link href='/foxxie/invite'>#241</Link> → <code>No Reason Specified</code>
            </DiscordMessage>
        </DiscordMessages>
    )
}

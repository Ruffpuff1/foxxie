import { DiscordCommand, DiscordMessage, DiscordMessages } from "@skyra/discord-components-react";

export function Wolfram() {
    return (
        <DiscordMessages>
            <DiscordMessage
                author='Kettu'
                bot
                avatar="https://cdn.ruffpuff.dev/kettu.png"
            >
                <DiscordCommand
                    slot="reply"
                    command='/wolfram'
                    avatar="https://cdn.discordapp.com/avatars/749845359689465977/9c54eb73461d8a51762990def86dce02.png?size=2048"
                    author="Cyrus"
                    roleColor="#5965f2"
                ></ DiscordCommand>
                George Washington  (from April 30, 1789  to  March 4, 1797), John Adams  (from March 4, 1797  to  March 4, 1801), Thomas Jefferson  (from March 4, 1801  to  March 4, 1809), and 43 more
            </DiscordMessage>
        </DiscordMessages>
    );
}

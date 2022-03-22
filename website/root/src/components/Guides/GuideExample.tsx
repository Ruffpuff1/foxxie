import { DiscordCommand, DiscordMessage, DiscordMessages } from "@skyra/discord-components-react";
import { ReactNode } from "react";

export function GuideExample(props: { children: ReactNode, commandName: string }) {
    return (
        <div className='mt-10 w-11/12 pl-16 xl:block lg:block md:block sm:hidden'>
            <DiscordMessages>
                <DiscordMessage
                    author='Foxxie'
                    bot
                    avatar="https://cdn.ruffpuff.dev/foxxie.png"
                >
                    <DiscordCommand
                        slot="reply"
                        command={`/${props.commandName}`}
                        avatar="https://cdn.ruffpuff.dev/ruffpuff.jpg"
                        author="Ruffpuff"
                        roleColor="#898489"
                    ></ DiscordCommand>
                    {props.children}
                </DiscordMessage>
            </DiscordMessages>
        </div>
    )
}

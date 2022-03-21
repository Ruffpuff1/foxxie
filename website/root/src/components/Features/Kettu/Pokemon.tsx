import { DiscordCommand, DiscordMessage, DiscordMessages, DiscordEmbed, DiscordEmbedField, DiscordEmbedFields, DiscordActionRow, DiscordButton, DiscordAttachments } from "@skyra/discord-components-react";

export function Pokemon() {
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
                    authorName="#37 - Vulpix"
                    thumbnail="https://cdn.ruffpuff.dev/ruffpuff.jpg"
                    authorImage="https://cdn.ruffpuff.dev/ruffpuff.jpg"
                    color="#a35119"
                >
                    <DiscordEmbedFields slot='fields'>
                        <DiscordEmbedField
                            fieldTitle='📜 Type'
                            inline
                            inlineIndex={1}
                        >
                            Fire
                        </DiscordEmbedField>
                        <DiscordEmbedField
                            fieldTitle='🔮 Abilities'
                            inline
                            inlineIndex={2}
                        >
                            Flash Fire and drought
                        </DiscordEmbedField>
                        <DiscordEmbedField
                            fieldTitle=''
                            inline
                            inlineIndex={3}
                        >

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

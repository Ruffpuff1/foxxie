import { DiscordCommand, DiscordMessage, DiscordMessages, DiscordEmbed, DiscordEmbedField, DiscordEmbedFields, DiscordActionRow, DiscordButton, DiscordAttachments, DiscordEmbedFooter } from "@skyra/discord-components-react";
import Link from "next/link";

export function Pokemon() {
    return (
        <DiscordMessages>
            <DiscordMessage
                author='Kettu'
                bot
                avatar="https://cdn.ruffpuff.dev/kettu.png"
            >
                <DiscordCommand
                    slot="reply"
                    command='/pokemon'
                    avatar="https://cdn.ruffpuff.dev/ruffpuff.jpg"
                    author="Ruffpuff"
                    roleColor="#898489"
                ></ DiscordCommand>
                <DiscordEmbed
                    slot='embeds'
                    authorName="#37 - Vulpix"
                    thumbnail="https://play.pokemonshowdown.com/sprites/ani/vulpix.gif"
                    color="#a35119"
                >
                    <DiscordEmbedFields slot='fields'>
                        <DiscordEmbedField fieldTitle='📜 Type' inline inlineIndex={1} >
                            Fire
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='🔮 Abilities' inline inlineIndex={2} >
                            Flash Fire and <i>drought</i>
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='🚻 Gender' inline inlineIndex={3} >
                            25% | 75%
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='🧬 Evolutions' >
                            <strong>Vulpix</strong> → <code>Ninetales</code> (use Fire Stone)
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='⚖️ Base stats' >
                            HP: <strong>38</strong>, ATK: <strong>41</strong>, DEF: <strong>40</strong>, SPA: <strong>50</strong>, SPD: <strong>65</strong>, SPE: <strong>65</strong> (<i>BST</i>: <strong>299</strong>)
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='🔍 External Resources' >
                            <Link href='https://bulbapedia.bulbagarden.net/wiki/vulpix_%28Pok%C3%A9mon%29'>Bulbapedia</Link> | <Link href='https://www.serebii.net/pokedex-swsh/vulpix'>Serebii</Link> | <Link href='https://www.smogon.com/dex/ss/pokemon/vulpix'>Smogon</Link>
                        </DiscordEmbedField>
                    </DiscordEmbedFields>
                    <DiscordEmbedFooter
                        slot='footer'
                    >
                        1 / 5
                    </DiscordEmbedFooter>
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

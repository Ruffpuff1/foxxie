import {
    DiscordCustomEmoji,
    DiscordEmbed,
    DiscordEmbedField,
    DiscordEmbedFields,
    DiscordMessage,
    DiscordMessages,
    DiscordTime
} from '@skyra/discord-components-react';
import { foxxieFeatures } from '../../../../../assets/foxxieFeatureData';

export default function RoleInfo() {
    return (
        <DiscordMessages className='rounded-sm duration-500 lg:rounded-lg'>
            <DiscordMessage roleColor='#898489' author='Ruffpuff' avatar='https://cdn.reese.cafe/reese.jpg'>
                .info role
            </DiscordMessage>
            <DiscordMessage roleColor='#5965f2' avatar='https://cdn.reese.cafe/foxxie.png' author='Foxxie' bot>
                <DiscordEmbed slot='embeds' authorImage='https://cdn.reese.cafe/emojis/ruff-giggle.png' authorName='Ruff [912226301908254720]' color='#898489'>
                    <DiscordEmbedFields slot='fields'>
                        <DiscordEmbedField fieldTitle='🎨 Color' inline inlineIndex={1}>
                            #E8EAEC
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='👥 Member' inline inlineIndex={2}>
                            1 users, 0 bots
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='🔨 Permissions'> Administrator (all permissions)</DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='📅 Created'>
                            <DiscordTime>November 21 2021</DiscordTime> (<DiscordTime>6 months ago</DiscordTime>)
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='📑 Properties'>
                            <DiscordCustomEmoji embedEmoji name='check' url='https://cdn.reese.cafe/emojis/perms-enabled.png' /> Displayed separately
                        </DiscordEmbedField>
                    </DiscordEmbedFields>
                </DiscordEmbed>
            </DiscordMessage>
            <DiscordMessage roleColor='#898489' author='Ruffpuff' avatar='https://cdn.reese.cafe/reese.jpg'>
                {foxxieFeatures.find(f => f.name === 'role-info')!.description}
            </DiscordMessage>
        </DiscordMessages>
    );
}

import { DiscordCustomEmoji, DiscordEmbed, DiscordEmbedField, DiscordEmbedFields, DiscordMessage, DiscordMessages, DiscordTime } from '@skyra/discord-components-react';
import { foxxieFeatures } from '../../../../../../assets/foxxieFeatureData';
import { Images } from '../../../../../../assets/images';

export default function RoleInfo() {
    return (
        <DiscordMessages className='rounded-sm duration-500 lg:rounded-lg'>
            <DiscordMessage roleColor='#898489' author='Ruffpuff' avatar={Images.Reese}>
                .info role
            </DiscordMessage>
            <DiscordMessage roleColor='#5965f2' avatar={Images.Foxxie} author='Foxxie' bot>
                <DiscordEmbed slot='embeds' authorImage={Images.RuffGiggle} authorName='Ruff [912226301908254720]' color='#898489'>
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
                            <DiscordCustomEmoji embedEmoji name='check' url={Images.PermsEnabled} /> Displayed separately
                        </DiscordEmbedField>
                    </DiscordEmbedFields>
                </DiscordEmbed>
            </DiscordMessage>
            <DiscordMessage roleColor='#898489' author='Ruffpuff' avatar={Images.Reese}>
                {foxxieFeatures.find(f => f.name === 'role-info')!.description}
            </DiscordMessage>
        </DiscordMessages>
    );
}

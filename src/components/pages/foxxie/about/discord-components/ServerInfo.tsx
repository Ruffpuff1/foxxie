import {
    DiscordEmbed,
    DiscordEmbedDescription,
    DiscordEmbedField,
    DiscordEmbedFields,
    DiscordMention,
    DiscordMessage,
    DiscordMessages,
    DiscordTime
} from '@skyra/discord-components-react';
import { foxxieFeatures } from '../../../../../assets/foxxieFeatureData';
import { Images } from '../../../../../assets/images';

export default function ServerInfo() {
    return (
        <DiscordMessages className='rounded-sm duration-500 lg:rounded-lg'>
            <DiscordMessage roleColor='#898489' author='Ruffpuff' avatar={Images.Reese}>
                .info server
            </DiscordMessage>
            <DiscordMessage roleColor='#5965f2' avatar={Images.Foxxie} author='Foxxie' bot>
                <DiscordEmbed
                    slot='embeds'
                    authorImage={Images.TheCornerStore}
                    authorName='The Corner Store [761512748898844702]'
                    authorUrl='https://discord.com/servers/761512748898844702'
                    color='#0F52BA'
                    thumbnail={Images.TheCornerStore}
                >
                    <DiscordEmbedDescription slot='description'>
                        Created by <strong>Ruffpuff#0017</strong> on <DiscordTime>October 2, 2020</DiscordTime> (<DiscordTime>1 year ago</DiscordTime>)<br />
                        <i>&quot;The Corner Store is a small shop on the side of the road that has many goods for you to buy.&quot;</i>
                    </DiscordEmbedDescription>
                    <DiscordEmbedFields slot='fields'>
                        <DiscordEmbedField fieldTitle='📜 Roles (63)'>
                            <DiscordMention type='role'>Fox Janitor</DiscordMention>,{' '}
                            <DiscordMention color='#18191C' type='role'>
                                <i>shut</i>
                            </DiscordMention>
                            ,{' '}
                            <DiscordMention color='#0F52BA' type='role'>
                                Moderator
                            </DiscordMention>
                            , <DiscordMention type='role'>Happy Birthday</DiscordMention>,{' '}
                            <DiscordMention color='#898489' type='role'>
                                Ruff
                            </DiscordMention>
                            ,{' '}
                            <DiscordMention color='#A8E7BF' type='role'>
                                Ruff&apos;s Best Friend
                            </DiscordMention>
                            , <DiscordMention type='role'>Justin the cute beaver boy</DiscordMention>,{' '}
                            <DiscordMention type='role' color='#52B1B1'>
                                Robots
                            </DiscordMention>
                            , <DiscordMention type='role'>Employees</DiscordMention>, and 52 more.
                        </DiscordEmbedField>

                        <DiscordEmbedField fieldTitle='👥 Members' inline inlineIndex={1}>
                            1,141 (cached: 2)
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='💬 Channels (47)' inline inlineIndex={2}>
                            Text: <strong>39</strong>, Voice: <strong>7</strong>, News: <strong>1</strong>
                        </DiscordEmbedField>
                        <DiscordEmbedField inline inlineIndex={3} fieldTitle='😎 Emojis (127)'>
                            Static: <strong>110</strong>
                            <br />
                            Animated: <strong>17</strong>
                        </DiscordEmbedField>

                        <DiscordEmbedField fieldTitle='📈 Statistics'>1,253,876 messages sent.</DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='🔒 Security'>
                            Verification level: Medium
                            <br />
                            Explicit filter: Scan messages by all members Image
                        </DiscordEmbedField>
                    </DiscordEmbedFields>
                </DiscordEmbed>
            </DiscordMessage>
            <DiscordMessage roleColor='#898489' author='Ruffpuff' avatar={Images.Reese}>
                {foxxieFeatures.find(f => f.name === 'server-info')!.description}
            </DiscordMessage>
        </DiscordMessages>
    );
}

import { DiscordEmbed, DiscordEmbedDescription, DiscordEmbedFooter, DiscordMessages } from '@skyra/discord-components-react';
import DiscordMessage from 'src/components/discord/DiscordMessage/DiscordMessage';
import { foxxieFeatures } from '../../../../../../assets/foxxieFeatureData';
import { Images } from '../../../../../../assets/images';

export default function ModerationLog() {
    return (
        <DiscordMessages lightTheme={false} className='rounded-sm duration-500 lg:rounded-lg'>
            <DiscordMessage roleColor='#5965f2' avatar={Images.Foxxie} author='Foxxie' bot>
                <DiscordEmbed slot='embeds' authorImage={Images.Foxxie} authorName='Banned User' color='#FF5C5C'>
                    <DiscordEmbedDescription slot='description'>
                        <strong>User</strong>: <code>nums#1627</code> (956351036212260884)
                        <br />
                        <strong>Moderator</strong>: <code>Foxxie#0656</code> (825130284382289920)
                        <br />
                        <strong>Location</strong>: <code>chat¹</code> (775306696658518027)
                        <br />
                        <strong>Reason</strong>: <code>[Anti Words]</code> Prohibited word sent.
                    </DiscordEmbedDescription>
                    <DiscordEmbedFooter slot='footer' timestamp='03/24/2022'>
                        Case #167
                    </DiscordEmbedFooter>
                </DiscordEmbed>
            </DiscordMessage>
            <DiscordMessage roleColor='#5965f2' avatar={Images.Foxxie} author='Foxxie' bot>
                <DiscordEmbed slot='embeds' authorImage='https://reese.cafe/images/assets/foxxie/justin.gif' authorName='Banned User' color='#FF5C5C'>
                    <DiscordEmbedDescription slot='description'>
                        <strong>User</strong>: <code>J_TOKEN$#5925</code> (980251029482385408)
                        <br />
                        <strong>Moderator</strong>: <code>Jutsu#0100</code> (282321212766552065)
                        <br />
                        <strong>Reason</strong>: Please use <code>.reason 168 [reason]</code> to set the reason.
                    </DiscordEmbedDescription>
                    <DiscordEmbedFooter slot='footer' timestamp='05/29/2022'>
                        Case #168
                    </DiscordEmbedFooter>
                </DiscordEmbed>
            </DiscordMessage>
            <DiscordMessage roleColor='#898489' author='Reese' avatar={Images.Reese}>
                {foxxieFeatures.find(f => f.name === 'moderation-log')!.description}
            </DiscordMessage>
        </DiscordMessages>
    );
}

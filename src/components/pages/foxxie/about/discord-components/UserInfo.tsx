import { DiscordEmbed, DiscordEmbedField, DiscordEmbedFields, DiscordMessage, DiscordMessages, DiscordTime } from '@skyra/discord-components-react';
import { foxxieFeatures } from '../../../../../assets/foxxieFeatureData';

export default function UserInfo() {
    return (
        <DiscordMessages lightTheme={false} className='rounded-sm duration-500 lg:rounded-lg'>
            <DiscordMessage roleColor='#898489' author='Ruffpuff' avatar='https://cdn.reese.cafe/reese.jpg'>
                .info channel
            </DiscordMessage>
            <DiscordMessage roleColor='#5965f2' avatar='https://cdn.reese.cafe/foxxie.png' author='Foxxie' bot>
                <DiscordEmbed
                    slot='embeds'
                    authorImage='https://cdn.reese.cafe/reese.jpg'
                    authorName='Ruffpuff#0017 [486396074282450946]'
                    authorUrl='https://discord.com/users/486396074282450946'
                    color='#0F52BA'
                    thumbnail='https://cdn.reese.cafe/reese.jpg'
                >
                    <DiscordEmbedFields slot='fields'>
                        <DiscordEmbedField fieldTitle='📝 About'>
                            Joined Discord on <DiscordTime>September 3, 2018</DiscordTime> (<DiscordTime>4 years ago</DiscordTime>)<br />
                            Created The Corner Store on <DiscordTime>October 2, 2020</DiscordTime> (<DiscordTime>2 years ago</DiscordTime>)<br />
                            106.81K messages sent.
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle='📜 Roles (14)'>
                            Ruff, Moderator, Server Boosters
                            <br />
                            ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
                            <br />
                            Senior Customers, Active, Patrons, Regulars,
                            <br />
                            Returnings, New Customer, Old Timers
                            <br />
                            ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
                            <br />
                            He/Him, They/Them
                        </DiscordEmbedField>
                    </DiscordEmbedFields>
                </DiscordEmbed>
            </DiscordMessage>
            <DiscordMessage roleColor='#898489' author='Ruffpuff' avatar='https://cdn.reese.cafe/reese.jpg'>
                {foxxieFeatures.find(f => f.name === 'user-info')!.description}
            </DiscordMessage>
        </DiscordMessages>
    );
}

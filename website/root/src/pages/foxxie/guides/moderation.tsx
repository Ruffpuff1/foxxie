import { DiscordCustomEmoji, DiscordEmbed, DiscordEmbedDescription, DiscordEmbedFooter } from '@skyra/discord-components-react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Content } from '../../../components/Content';
import { Ban } from '../../../components/Features/Foxxie/Ban';
import { Footer } from '../../../components/Footer';
import { GuideBox } from '../../../components/Guides/GuideBox';
import { GuideExample } from '../../../components/Guides/GuideExample';
import { GuideSection } from '../../../components/Guides/GuideSection';
import { Nav } from '../../../components/Nav';
import { Guidepage } from '../../../components/Pages/Guidepage';

const Moderation: NextPage = () => {
    return (
        <div>
            <Nav />

            <Content>

                <Guidepage
                    title="Foxxie's Moderation"
                    summary={[
                        'Foxxie has an advanced moderation system, but that doesn\'t mean that it\'s difficult to use.',
                        'The following guide outlines how to use Foxxie\'s moderation system.'
                    ].join(' ')}
                >

                    <GuideSection
                        id='ban'
                        title='Ban'
                    >
                        <GuideBox>
                            The ban command is a powered up version of the Discord built in ban command.{' '}
                            It includes the <code>target</code> argument as the user you want to ban.{' '}
                            Plus the <code>reason</code> and <code>days</code> arguments, reason being the reason for the ban that will be posted in the audit logs.{' '}
                            Days will be the amount of days worth of messages that will be deleted from the user upon ban.
                        </GuideBox>
                        <GuideBox>
                            The additional two arguments are the <code>duration</code> argument and the <code>refrence</code> argument.{' '}
                            If included the duration argument will make the ban temporary with the specified duration as it&apos;s length.{' '}<br />
                            See <a href="#formatting-duration" className='hover:text-salmon duration-500' ><i>formatting durations{' '}&rsaquo;</i></a>{' '}
                            for more information on formatting duration values.
                        </GuideBox>
                        <GuideBox>
                            If set all ban actions will be logged to your moderation logging channel.{' '}Manual bans (though the Discord UI) will automatically be logged as well.<br />

                            <div className='mt-10 w-11/12 pl-16'>
                                <Ban />
                            </div>
                        </GuideBox>
                    </GuideSection>

                    <GuideSection
                        id='kick'
                        title='Kick'
                    >
                        <GuideBox>
                            The kick command is a relatively simple modification of Discord&apos;s built in kick command.<br />
                            The only difference being that all kicks with the command will be logged to your moderation logging channel if one is set up.<br />
                            Additonally manual kicks (though Discord&apos;s UI) will be automatically logged in the logging channel.

                            <GuideExample
                                commandName='kick'
                            >
                                <DiscordCustomEmoji
                                    name='sucess'
                                    url="https://cdn.ruffpuff.dev/emojiCheck.png"
                                /> Successfully kicked <strong>Cyrus#9319</strong>, created case <Link href='/foxxie/invite'>#17</Link> → <code>No Reason Specified</code>
                            </GuideExample>
                        </GuideBox>
                    </GuideSection>

                    <GuideSection
                        id='case'
                        title='Case'
                    >
                        <GuideBox>
                            The case command can be used to view prior moderation cases logged to the moderation channel.<br />
                            Each moderation case is assigned a case id, this id can be used with the case command to view it again as shown below.

                            <GuideExample
                                commandName='case'
                            >
                                <DiscordEmbed slot='embeds' authorName='Unmuted Member' authorImage='https://cdn.ruffpuff.dev/foxxie.png' color='#5DBA7E'>
                                    <DiscordEmbedDescription slot='description'>
                                        <strong>User</strong>: <code>Waindwop ᓚᘏᗢ#7799</code> (675077363457065020)<br />
                                        <strong>Moderator</strong>: <code>Foxxie#0656</code> (825130284382289920)<br />
                                        <strong>Location</strong>: <code>general</code> (826893949880631379)<br />
                                        <strong>Reason</strong>: <code>[Temp Mute]</code> Released after 20 seconds<br />
                                        <strong>Refrence</strong>: <Link href='/foxxie/invite'>#11</Link>
                                    </DiscordEmbedDescription>
                                    <DiscordEmbedFooter slot='footer' timestamp={new Date()}>
                                        Case #12
                                    </DiscordEmbedFooter>
                                </DiscordEmbed>
                            </GuideExample>
                        </GuideBox>
                    </GuideSection>

                    <GuideSection
                        id='formatting-duration'
                        title='Formatting Durations'
                    >
                        <GuideBox>
                            For duration arguments in temporary moderation actions Foxxie can accept a number of formats for times.<br />
                            An example will use is <code>7 days</code>. You can format that as the following:<br /><br/>
                            <ul>
                                <li>&rsaquo; <code>7d</code></li>
                                <li>&rsaquo; <code>1w</code></li>
                                <li>&rsaquo; <code>7days</code></li>
                                <li>&rsaquo; <code>&quot;7 days&quot;</code></li>
                            </ul>
                        </GuideBox>

                        <GuideBox>
                            You can also combine durations for narrowing down time windows. For example if you want to do a duration of <code>1 week 2 days</code> you can format it as such:<br /><br />
                            <ul>
                                <li>&rsaquo; <code>1w2d</code></li>
                                <li>&rsaquo; <code>9d</code></li>
                                <li>&rsaquo; <code>1week2days</code></li>
                                <li>&rsaquo; <code>&quot;1w 2d&quot;</code></li>
                            </ul>
                        </GuideBox>

                        <GuideBox>
                            Notice how if you want to include spaces in the duration you must surround it with &quot;double quotes&quot;.
                        </GuideBox>
                    </GuideSection>

                </Guidepage>

            </Content>

            <Footer />
        </div>
    );
};

export default Moderation;

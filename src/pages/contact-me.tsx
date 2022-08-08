/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '../assets/images';
import Head from 'next/head';
import AboutMain from '../components/pages/about-me/AboutMain';
import Contacts from '../components/pages/contact-me/Contacts';

const ContactMe: NextPage = () => {
    return (
        <>
            <Head>
                <link rel='icon' href={Images.Reese} />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>
            <NextSeo
                title='Contact Me - Reese Harlak'
                description="Hi there, this is where you can find me on social media or my email address. Don't hesitate to reach out if you need something!"
                openGraph={{
                    title: 'Contact Me - Reese Harlak',
                    description: "Hi there, this is where you can find me on social media or my email address. Don't hesitate to reach out if you need something!"
                }}
            />

            <AboutMain>
                <div className='mt-36 flex flex-col items-center'>
                    <h1 className='text-2xl md:text-4xl'>Contact me</h1>
                </div>
                <Contacts />
            </AboutMain>
        </>
    );
};

export default ContactMe;

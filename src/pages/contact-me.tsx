import AboutMain from '@about-me/AboutMain';
import Contacts from '@contact-me/Contacts';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';

const ContactMe: NextPage = () => {
    return (
        <>
            <Meta
                title='Contact Me - Reese Harlak'
                description="Hi there, this is where you can find me on social media or my email address. Don' t hesitate to reach out if you need something!"
                keywords={['reese', 'reese harlak', 'web', 'react', 'next.js', 'developer', 'contact', 'email', 'github']}
                subject='My work'
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

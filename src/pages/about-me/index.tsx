import AboutMain from '@about-me/AboutMain';
import Article from '@about-me/Article';
import Header from '@about-me/Header';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';

const AboutMe: NextPage = () => {
    return (
        <>
            <Meta
                title='About Me - Reese Harlak'
                description='Learn more about me, my projects, and contact me if you would like to talk about potential projects.'
                keywords={['reese', 'reese harlak', 'web', 'react', 'next.js', 'developer', 'student', 'music']}
                subject='About Reese Harlak'
            />

            <AboutMain>
                <Header />
                <Article />
            </AboutMain>
        </>
    );
};

export default AboutMe;

import HomeAboutSection from '@home/HomeAboutSection';
import HomeTopSection from '@home/HomeTopSection';
import Main from '@home/Main';
import useLocale from '@hooks/useLocale';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';

const Home: NextPage = () => {
    const [translations] = useLocale();

    return (
        <>
            <Meta
                title={translations.home.title}
                description={translations.home.description}
                keywords={['reese', 'reese harlak', 'web', 'react', 'next.js', 'developer', 'student', 'music']}
                subject='The homepage of my website.'
            />

            <Main>
                <HomeTopSection />
                <HomeAboutSection />
                {/* <section className='flex h-[900px] flex-col items-center justify-center'></section> */}
            </Main>
        </>
    );
};

export default Home;

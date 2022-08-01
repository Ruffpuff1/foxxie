import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import Banner from '@arts-culture/story/mlm-pride/Banner';
import { storys } from '@assets/arts-and-culture/data';
import { PrideStory } from '@assets/arts-and-culture/structures';
import { StoryComponents } from '@assets/arts-and-culture/data/PrideStories/PrideStoriesComponents';

const Story: NextPage<Props> = ({ id }) => {
    const story = storys.find(story => story.id === id)!;
    const Component = StoryComponents.get(story.id)!;

    return (
        <>
            <Head>
                <link rel='icon' href='https://reese.cafe/images/icons/rainbow.png' />
                <meta name='theme-color' content='#027B83' />
            </Head>
            <NextSeo
                title={`${story.name} - ${story instanceof PrideStory ? 'Reese Pride' : 'Reese Arts & Culture'}`}
                description=''
                openGraph={{
                    title: `${story.name} - ${story instanceof PrideStory ? 'Reese Pride' : 'Reese Arts & Culture'}`,
                    description: ''
                }}
            />

            <Banner story={story} />
            <Component story={story} />
        </>
    );
};

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
    const path = params?.id as string;
    const story = storys.find(c => c.id === path);

    if (!story)
        return {
            notFound: true
        };

    return {
        props: {
            id: story.id
        }
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: storys.map(l => ({
            params: {
                id: l.id
            }
        })),

        fallback: 'blocking'
    };
};

interface Props {
    id: string;
}

export default Story;

import AboutMain from '@about-me/AboutMain';
import AllProjects from '@my-work/all-projects/AllProjects';
import WorkHeader from '@my-work/header/WorkHeader';
import WorkLatest from '@my-work/WorkLatest';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';

const MyWork: NextPage = () => {
    return (
        <>
            <Meta
                title='Take a look at my personal projects'
                description='Here are my most prevelent projects. All designed to help make our lives easier, and show off my work.'
                keywords={['reese', 'reese harlak', 'web', 'react', 'next.js', 'developer', 'work', 'projects']}
                subject='My work'
            />

            <AboutMain>
                <WorkHeader />
                <WorkLatest />
                <AllProjects />
            </AboutMain>
        </>
    );
};

export default MyWork;

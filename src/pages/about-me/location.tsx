import LocationMap from '@about-me/location/LocationMap';
import Main from '@home/Main';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';

const Location: NextPage = () => {
    return (
        <>
            <Meta
                title='My Location - Reese Harlak'
                description='Learn more about me, my projects, and contact me if you would like to talk about potential projects.'
                noRobots
            />

            <Main>
                <h1 className='mt-20 flex justify-center py-5 text-xl md:text-2xl'>My location</h1>
                <LocationMap />
                <h2 className='mx:text-xl mb-40 flex justify-center py-5 text-lg'>
                    Born and raised in Orange County, California.
                    <br />
                </h2>
            </Main>
        </>
    );
};

export default Location;

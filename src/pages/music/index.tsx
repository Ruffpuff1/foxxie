import Meta from '@ui/Meta';
import Navbar from '@ui/Navbar/Navbar';
import type { NextPage } from 'next';

const Music: NextPage = () => {
    return (
        <>
            <Meta title='Music' description='' icon='https://reese.cafe/images/icons/violin.png' noRobots />

            <Navbar
                noHoverIndicators
                home='/music'
                links={[{ path: '/music/orchestra', text: 'Orchestra' }]}
                title=' Music'
                icon='https://reese.cafe/images/icons/violin.png'
            />
        </>
    );
};

export default Music;

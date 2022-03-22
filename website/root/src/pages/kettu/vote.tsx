import type { NextPage } from 'next';
import { useEffect } from 'react';
import { KETTU_ID } from '../../utils/constants';

const Vote: NextPage = () => {
    useEffect(() => {
        window.location.href = `https://top.gg/bot/${KETTU_ID}/vote`;
    }, []);

    return (
        <>
        </>
    );
};

export default Vote;

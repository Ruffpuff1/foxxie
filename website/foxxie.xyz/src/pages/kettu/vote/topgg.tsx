import type { NextPage } from 'next';
import { TopggVotepage } from '../../../components/pages/TopggVotepage';
import { KETTU_ID } from '../../../utils/constants';

const Vote: NextPage = () => {
    return (
        <>
            <TopggVotepage id={KETTU_ID} />
        </>
    );
};

export default Vote;

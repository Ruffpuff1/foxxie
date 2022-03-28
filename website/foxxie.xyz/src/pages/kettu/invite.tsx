import type { NextPage } from 'next';
import { Invitepage } from '../../components/pages/Invitepage';
import { kettuPermissions } from '../../utils/constants';

const Invite: NextPage = () => {
    return (
        <>
            <Invitepage perms={kettuPermissions} />
        </>
    );
};

export default Invite;

import { useAuth } from '@hooks/useAuth';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import styles from './AuthInformation.module.css';

const Image = dynamic(() => import('next/image'), { ssr: false });

export default function AuthInformation({ shiftLeft }: Props) {
    const [user, { signOut, signIn }] = useAuth();
    const [showSignIn, setShowSignIn] = useState(false);

    useEffect(() => {
        setShowSignIn(user !== null);
    }, [user]);

    return showSignIn ? (
        <button
            onClick={signOut}
            className={clsx(styles.auth_image_wrapper, {
                [styles.auth_image_wrapper_shift_left]: shiftLeft,
                [styles.auth_image_wrapper_shift_none]: !shiftLeft
            })}
        >
            <Image height={32} width={32} src={user?.photoURL as string} className={styles.auth_image} alt='Click to sign out of account' />
        </button>
    ) : (
        <button onClick={signIn} className='sign-in rounded-md bg-white px-5 py-2 text-blue-500 hover:shadow-md'>
            <span>Sign In</span>
        </button>
    );
}

interface Props {
    signOutPath?: string;
    shiftLeft?: boolean;
}

import { useAuth } from '@hooks/useAuth';
import { auth, database, GoogleAuth } from '@utils/firebase';
import clsx from 'clsx';
import { signInWithPopup, signOut as signOutFirebase } from 'firebase/auth';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';

export default function AuthInformation({ signOutPath, shiftLeft }: Props) {
    const [, user] = useAuth();

    const signIn = async () => {
        auth.onAuthStateChanged(async u => {
            if (u) {
                const q = query(database.users, where('userId', '==', u.uid));

                const docs = await getDocs(q);

                if (!docs.docs.length) {
                    await addDoc(database.users, {
                        userId: u.uid,
                        google: {
                            displayName: u.displayName,
                            email: u.email,
                            photoURL: u.photoURL
                        }
                    });
                }
            }
        });

        await signInWithPopup(auth, GoogleAuth).catch(() => null);
    };

    const signOut = async () => {
        await signOutFirebase(auth);

        auth.onAuthStateChanged(() => {
            if (signOutPath) window.location.href = signOutPath;
        });
    };

    return (
        <>
            {user?.user.google.photoURL ? (
                <button
                    onClick={() => signOut()}
                    className={clsx('flex items-center justify-center rounded-full p-1 hover:bg-gray-100', {
                        'mr-[18rem]': shiftLeft,
                        'mr-0': !shiftLeft
                    })}
                >
                    <Image height={32} width={32} src={user.user.google.photoURL} className='rounded-full' alt='Click to sign out of account' />
                </button>
            ) : (
                <button onClick={() => signIn()} className='sign-in rounded-md bg-white px-5 py-2 text-blue-500 hover:shadow-md'>
                    Sign In
                </button>
            )}
        </>
    );
}

interface Props {
    signOutPath?: string;
    shiftLeft?: boolean;
}

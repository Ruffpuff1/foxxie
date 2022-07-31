import { signInWithPopup, signOut as signOutFirebase } from 'firebase/auth';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '@hooks/useAuth';
import { auth, database, GoogleAuth } from '@utils/firebase';
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
                    className={`flex items-center justify-center rounded-full p-1 duration-200 ease-in hover:bg-gray-100 ${shiftLeft ? 'mr-[18rem]' : 'mr-0'}`}
                >
                    <Image height={32} width={32} src={user.user.google.photoURL} className='rounded-full' alt={`Click to sign out of account`} />
                </button>
            ) : (
                <button onClick={() => signIn()} className='rounded-md bg-blue-500 px-5 py-2 text-white hover:shadow-md'>
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

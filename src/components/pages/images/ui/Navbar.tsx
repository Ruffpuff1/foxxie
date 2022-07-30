import { TodoContext } from '@hooks/useTodo';
import { signInWithPopup, signOut as signOutFirebase } from 'firebase/auth';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { useContext } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { auth, database, GoogleAuth } from 'src/utils/firebase';

export default function Navbar() {
    const [, user] = useAuth();
    const { showTodo } = useContext(TodoContext);

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
            window.location.href = '/images';
        });
    };

    return (
        <header className='fixed top-0 right-0 z-[0.4] flex w-full items-center justify-between border-b border-b-gray-200 bg-white px-2 py-1 shadow-md duration-200 sm:shadow-sm md:px-3'>
            <div className='flex items-center space-x-2 py-3'>
                <Image height={32} width={32} src='https://reese.cafe/images/icons/upload.png' alt='Cdn' />
                <a href='/images' className='text-2xl text-gray-500 duration-200 hover:text-blue-500 hover:underline'>
                    Cdn
                </a>
            </div>

            {user?.user.google.photoURL ? (
                <button
                    onClick={() => signOut()}
                    className={`flex items-center justify-center rounded-full p-1 duration-200 ease-in hover:bg-gray-100 ${showTodo ? 'mr-[18rem]' : 'mr-0'}`}
                >
                    <Image height={32} width={32} src={user.user.google.photoURL} className='rounded-full' alt={`Click to sign out of account`} />
                </button>
            ) : (
                <button onClick={() => signIn()} className='rounded-md bg-blue-500 px-5 py-2 text-white hover:shadow-md'>
                    Sign In
                </button>
            )}
        </header>
    );
}

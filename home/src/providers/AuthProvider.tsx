import { useCookie } from '@reeseharlak/usehooks';
import { cast, days } from '@ruffpuff/utilities';
import { auth, database, GoogleAuth } from '@util/firebase';
import { isValid } from '@util/utils';
import { signInWithPopup, signOut as signOutFirebase, User } from 'firebase/auth';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext<Context>({
    user: null,
    props: {
        message: '',
        signIn: () => {
            /** */
        },
        signOut: () => {
            /** */
        }
    }
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [cookieUser, setValue] = useCookie('user', { expires: days(7) });
    const [parsedCookie, setParsedCookie] = useState(cookieUser ? cast<User>(JSON.parse(cookieUser)) : null);

    useEffect(() => {
        setParsedCookie(cookieUser ? cast<User>(JSON.parse(cookieUser)) : null);
    }, [cookieUser]);

    const valid = isValid(parsedCookie);
    const message = parsedCookie ? (valid ? '' : 'no-valid') : 'no-login';

    const ctx = useMemo(() => {
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

                    setValue(JSON.stringify(u));
                }
            });

            await signInWithPopup(auth, GoogleAuth).catch(() => null);
        };

        const signOut = async () => {
            await signOutFirebase(auth);

            auth.onAuthStateChanged(() => {
                setValue(undefined!);
            });
        };

        return { props: { signIn, message, signOut }, user: parsedCookie };
    }, [parsedCookie, message, setValue]);

    return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}

interface Props {
    message: string;
    signIn: () => void;
    signOut: () => void;
}

export interface Context {
    user: User | null;
    props: Props;
}

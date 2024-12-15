import Navbar from '@developers/Navbar';
import { ReactNode } from 'react';

export default function Main({ children }: Props) {
    return (
        <>
            <Navbar />

            {children}
        </>
    );
}

interface Props {
    children: ReactNode;
}

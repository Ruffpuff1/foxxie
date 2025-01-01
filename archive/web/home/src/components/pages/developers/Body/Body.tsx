import Copyright from '@developers/Copyright/Copyright';
import Footer from '@developers/Footer/Footer';
import { ReactNode } from 'react';
import styles from './Body.module.css';

export default function Body({ children }: Props) {
    return (
        <div id='devsite-body' className={styles.body}>
            <div className='pb-10 pr-[1rem] pl-[1rem] lg:pr-[4rem] lg:pl-[calc(270px+4rem)]'>
                {children}

                <Copyright />
            </div>

            <Footer />
        </div>
    );
}

interface Props {
    children: ReactNode;
    full?: boolean;
}

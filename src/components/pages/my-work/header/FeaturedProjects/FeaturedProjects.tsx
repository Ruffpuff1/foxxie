import { Icons } from '@assets/images';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './FeaturedProjects.module.css';

const Featured: Project[] = [
    {
        icon: 'https://reese.cafe/images/icons/foxxie.png',
        url: '/foxxie/about',
        header: 'Easily build and manage communities with Foxxie'
    },
    {
        icon: Icons.Developers,
        url: '/developers',
        header: 'Developer tooling, guides, and REST APIs'
    },
    {
        icon: 'https://reese.cafe/images/icons/todo.png',
        url: '/todo',
        header: 'Keep track of tasks with todo'
    }
];

export default function FeaturedProjects() {
    const router = useRouter();
    const nav = (url: string) => router.push(url);

    const [first, second, third] = Featured;

    return (
        <div className={styles.wrapper}>
            <div className={styles.top_two_wrapper}>
                <button onClick={() => nav(first.url)} className={styles.box_button}>
                    <Image width={210} height={210} src={first.icon} alt={first.header} />

                    <div className={styles.box_header_section}>
                        <h2 className={styles.box_header}>{first.header}</h2>
                    </div>
                </button>

                <button onClick={() => nav(second.url)} className={styles.box_button}>
                    <Image width={210} height={210} src={second.icon} alt={second.header} />

                    <div className={styles.box_header_section}>
                        <h2 className={styles.box_header}>{second.header}</h2>
                    </div>
                </button>
            </div>

            <button onClick={() => nav(third.url)} className={styles.box_button_bottom}>
                <Image width={210} height={210} src={third.icon} alt={third.header} />

                <div className={styles.box_header_section}>
                    <h2 className={styles.box_header}>{third.header}</h2>
                </div>
            </button>
        </div>
    );
}

interface Project {
    header: string;
    url: string;
    icon: string;
}

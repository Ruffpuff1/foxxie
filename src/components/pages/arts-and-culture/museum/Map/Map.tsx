import { Museum } from '@assets/arts-and-culture/structures';
import styles from './Map.module.css';

export default function Map({ museum }: { museum: Museum }) {
    return (
        <iframe
            src={`https://www.google.com/maps/embed?pb=${museum.map}`}
            className={styles.map}
            title='map'
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
        />
    );
}

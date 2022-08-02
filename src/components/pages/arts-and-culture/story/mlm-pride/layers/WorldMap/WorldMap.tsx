/* eslint-disable @next/next/no-img-element */
import { useClickOutside } from '@ruffpuff/usehooks';
import { useState } from 'react';
import styles from './WorldMap.module.css';
import useVisibility from 'src/hooks/useVisibility';

export default function WorldMap() {
    const [expandAmericas, setExpandAmerica] = useState(false);
    const [expandAfrica, setExpandAfrica] = useState(true);
    const [expandAsia, setExpandAsia] = useState(false);
    const [expandGreece, setExpandGreece] = useState(false);

    const [africaRef] = useClickOutside<HTMLButtonElement>(() => {
        if (expandAfrica) setExpandAfrica(false);
    });

    const [greeceRef] = useClickOutside<HTMLButtonElement>(() => {
        if (expandGreece) setExpandGreece(false);
    });

    const [americaRef] = useClickOutside<HTMLButtonElement>(() => {
        if (expandAmericas) setExpandAmerica(false);
    });

    const [asiaRef] = useClickOutside<HTMLButtonElement>(() => {
        if (expandAsia) setExpandAsia(false);
    });

    const [mapVisible, , ref] = useVisibility<HTMLDivElement>();

    const closePanels = () => {
        setExpandAfrica(false);
        setExpandAmerica(false);
        setExpandAsia(false);
        setExpandGreece(false);
    };

    const toggleAfrica = () => {
        closePanels();
        setExpandAfrica(!expandAfrica);
    };

    const toggleAsia = () => {
        closePanels();
        setExpandAsia(!expandAsia);
    };

    const toggleAmerica = () => {
        closePanels();
        setExpandAmerica(!expandAmericas);
    };

    const toggleGreece = () => {
        closePanels();
        setExpandGreece(!expandGreece);
    };

    return (
        <div ref={ref} className={styles.map_section}>
            <h1 className={`${styles.map_header} ${mapVisible ? styles.map_header_full : styles.map_header_hidden}`}>History in the early world</h1>

            <button
                ref={greeceRef}
                onClick={toggleGreece}
                className={`${styles.map_box} ${styles.map_box_greece} ${expandGreece && mapVisible ? styles.map_box_expanded : styles.map_box_closed}`}
            >
                <h2 className={`${styles.map_box_header} ${expandGreece && mapVisible ? styles.in : styles.out}`}>Greece</h2>

                <div className={styles.map_box_p_container}>
                    <img
                        className={`${styles.greece_image} ${expandGreece && mapVisible ? styles.in : styles.out}`}
                        src='https://reese.cafe/images/assets/arts-and-culture/assets/paintings/VGhlIERlYXR.jpg'
                        alt='The Death of Hyacinthos by Jean Broc (1801)'
                    />

                    <p className={styles.map_box_p}>
                        Ming dynasty literature, such as Bian Er Chai (弁而釵/弁而钗), portray homosexual relationships between men as more enjoyable and more
                        “harmonious” than heterosexual relationships.
                    </p>
                </div>
            </button>

            <button
                ref={asiaRef}
                onClick={toggleAsia}
                className={`${styles.map_box} ${styles.map_box_asia} ${expandAsia && mapVisible ? styles.map_box_expanded : styles.map_box_closed}`}
            >
                <h2 className={`${styles.map_box_header} ${expandAsia && mapVisible ? styles.in : styles.out}`}>East Asia</h2>

                <div className={styles.map_box_p_container}>
                    <p className={styles.map_box_text}>
                        Homosexuality in China, also known as the “passions of the cut peach” and various other euphemisms has been recorded since approximately 600 BCE.
                    </p>

                    <img
                        className={`${styles.map_box_img} ${expandAsia && mapVisible ? styles.in : styles.out}`}
                        src='https://reese.cafe/images/assets/arts-and-culture/assets/paintings/QSB5b3V0aCBhYm.jpg'
                        alt='Two young men about to have relations. Qing China, date unknown.'
                    />

                    <p className={styles.map_box_p}>
                        Ming dynasty literature, such as Bian Er Chai (弁而釵/弁而钗), portray homosexual relationships between men as more enjoyable and more
                        “harmonious” than heterosexual relationships.
                    </p>
                </div>
            </button>

            <button
                ref={americaRef}
                onClick={toggleAmerica}
                className={`${styles.map_box} ${styles.map_box_america} ${expandAmericas && mapVisible ? styles.map_box_expanded : styles.map_box_closed}`}
            >
                <h2 className={`${styles.map_box_header} ${expandAmericas && mapVisible ? styles.in : styles.out}`}>Americas</h2>

                <div className={styles.map_box_p_container}>
                    <p className={styles.map_box_text}>
                        Evidence of homoerotic sexual acts between men has been found in many pre-conquest civilizations in Latin America, such as the Aztecs, Mayas,
                        Quechuas, Moches, Zapotecs, the Incas, and the Tupinambá of Brazil.
                    </p>

                    <img
                        className={`${styles.map_box_img} ${expandAmericas && mapVisible ? styles.in : styles.out}`}
                        src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Larco_Museum_Erotic_Art_V.jpg/170px-Larco_Museum_Erotic_Art_V.jpg'
                        alt='Pre-Columbian ceramic of two men engaging in oral sex'
                    />

                    <p className={styles.map_box_p}>
                        During this time, Spanish conquistadors expressed horror at discovering sodomy openly practiced among native men and used it as evidence of their
                        supposed inferiority.
                    </p>

                    <p className={styles.map_box_p}>
                        During the period following European colonization, homosexuality was prosecuted by the Inquisition, sometimes leading to death sentences on the
                        charges of sodomy.
                    </p>
                </div>
            </button>

            <button
                ref={africaRef}
                onClick={toggleAfrica}
                className={`${styles.map_box} ${styles.map_box_africa} ${expandAfrica && mapVisible ? styles.map_box_expanded : styles.map_box_closed}`}
            >
                <h2 className={`${styles.map_box_header} ${expandAfrica && mapVisible ? styles.in : styles.out}`}>Africa</h2>

                <div className={styles.map_box_p_container}>
                    <img
                        className={`${styles.africa_image} ${expandAfrica && mapVisible ? styles.in : styles.out}`}
                        src='https://reese.cafe/images/assets/arts-and-culture/assets/photographs/bWFzdGFiYS1.jpg'
                        width={667}
                        height={500}
                        alt='Khnumhotep and Niankhkhnum nose-kissing'
                    />

                    <p className={styles.map_box_p}>
                        The first record of a possible homosexual male couple in history is regarded as Khnumhotep and Niankhkhnum. An ancient Egyptian couple, lived
                        around 2400 BCE. The pair are portrayed in a nose-kissing position, the most intimate pose in Egyptian art.
                    </p>

                    <p className={styles.map_box_p}>
                        More recently, the European colonization of Africa resulted in the introduction of anti-sodomy laws. This is generally regarded as the reason why
                        African nations have such strict laws against gay men today.
                    </p>
                </div>
            </button>
        </div>
    );
}

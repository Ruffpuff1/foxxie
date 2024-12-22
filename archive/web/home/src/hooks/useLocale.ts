import enUS from '@assets/locales/en_us';
import esMX from '@assets/locales/es_mx';
import { Locale, Translations } from '@assets/locales/types';
import { detectLocale } from '@util/intl';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const allowedLocales = ['en_us', 'es_mx'];

export default function useLocale(): [Translations, Locale] {
    const router = useRouter();
    const [translations, setTranslations] = useState(enUS);
    const [locale, setLocale] = useState('en_us');

    useEffect(() => {
        const loc = detectLocale(router.asPath);
        const hl: Locale = allowedLocales.includes(loc!) ? (loc as Locale) : 'en_us';

        setLocale(hl);

        switch (hl) {
            case 'en_us':
                setTranslations(enUS);
                break;
            case 'es_mx':
                setTranslations(esMX);
                break;
        }
    }, [router.asPath, setLocale]);

    return [translations, locale as Locale];
}

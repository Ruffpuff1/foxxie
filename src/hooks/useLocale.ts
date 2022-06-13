import { useRouter } from 'next/router';
import { Locale, Translations } from '../assets/types';
import enUS from '../assets/locales/en_us';
import esMX from '../assets/locales/es_mx';
import frFr from '../assets/locales/fr_fr';

export default function useLocale(): [Translations, Locale] {
    const router = useRouter();

    const hl = (router.locale ?? null) as Locale | null;

    switch (hl) {
        case 'es_mx':
            return [esMX, hl];
        case 'fr_fr':
            return [frFr, hl];
        default:
            return [enUS, hl!];
    }
}

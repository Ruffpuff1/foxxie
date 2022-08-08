import enUS from '@assets/locales/en_us';
import esMX from '@assets/locales/es_mx';
import { Locale, Translations } from '@assets/types';
import { useRouter } from 'next/router';

export default function useLocale(): [Translations, Locale] {
    const router = useRouter();
    const hl = (router.locale as Locale) ?? null;

    switch (hl) {
        case 'es_mx':
            return [esMX, hl];
        default:
            return [enUS, hl!];
    }
}

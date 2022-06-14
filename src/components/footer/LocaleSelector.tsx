import { useRouter } from 'next/router';
import useLocale from '../../hooks/useLocale';

export default function LocaleSelector() {
    const router = useRouter();
    const [, hl] = useLocale();

    return (
        <select
            name='language'
            id='language'
            value={getValue(hl)}
            onChange={async e => {
                return router.push(router.asPath, undefined, { locale: e.target.value });
            }}
            className='rounded-md bg-transparent p-3 text-sm duration-500 hover:cursor-pointer hover:bg-gray-200 md:text-lg'
        >
            {['en_us', 'es_mx', 'fr_fr'].map(loc => {
                return (
                    <option key={loc} value={loc}>
                        {getName(loc)}
                    </option>
                );
            })}
        </select>
    );
}

function getName(loc: string) {
    switch (loc) {
        case 'es_mx':
            return 'Español';
        case 'fr_fr':
            return 'Français';
        case 'en_us':
            return 'English';
    }
}

function getValue(hl: string | null) {
    if (hl === null) return 'en_us';
    return hl;
}

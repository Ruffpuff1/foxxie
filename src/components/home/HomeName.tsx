import useLocale from '../../hooks/useLocale';

export default function HomeName() {
    const [translations] = useLocale();

    return (
        <div className='flex h-full flex-col items-center justify-center md:items-start'>
            <h2 className='hidden px-12 font-semibold md:block md:text-2xl'>{translations.home.hi}</h2>
            <h2 className='space-x-2 px-12 text-4xl font-bold md:text-6xl'>Reese Harlak</h2>
        </div>
    );
}

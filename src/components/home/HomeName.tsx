import useLocale from '../../hooks/useLocale';

export default function HomeName() {
    const [translations] = useLocale();

    return (
        <div className='flex h-full flex-col items-center justify-center duration-500 md:items-start'>
            <h2 className='hidden md:block px-12 font-semibold md:text-2xl'>{translations.home.hi}</h2>
            <h2 className='space-x-2 px-12 text-4xl font-bold md:text-6xl'>
                <span className='duration-500'>Reese</span>
                <span className='from-blue-500 to-green-500 bg-clip-text duration-500 hover:cursor-pointer hover:bg-gradient-to-r hover:text-transparent'>Harlak</span>
            </h2>
        </div>
    );
}

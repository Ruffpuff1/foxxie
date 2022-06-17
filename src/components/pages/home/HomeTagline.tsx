import useLocale from '../../../hooks/useLocale';

export default function HomeTagline() {
    const [translations] = useLocale();

    return (
        <h4 className='text-center text-gray-700 md:ml-56 md:text-start'>
            {translations.home.tag}{' '}
            <a className='hover:text-blue-500' href='https://ruffpuff.dev/music'>
                {translations.home.musician}
            </a>
            .
        </h4>
    );
}

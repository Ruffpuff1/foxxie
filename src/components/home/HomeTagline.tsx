import useLocale from '../../hooks/useLocale';

export default function HomeTagline() {
    const [translations] = useLocale();

    return (
        <h4 className='text-center text-gray-700 duration-500 md:ml-56 md:text-start'>
            {translations.home.tag}{' '}
            <a className='duration-500 hover:text-blue-500' href='https://ruffpuff.dev/music'>
                {translations.home.musician}
            </a>
            .
        </h4>
    );
}

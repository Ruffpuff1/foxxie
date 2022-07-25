import useLocale from '../../../hooks/useLocale';

export default function HomeTagline() {
    const [translations] = useLocale();

    return (
        <h4 className='text-center text-gray-700'>
            {translations.home.tag}{' '}
            <a className='hover:text-blue-500' href='https://reese.cafe/music'>
                {translations.home.musician}
            </a>
            .
        </h4>
    );
}

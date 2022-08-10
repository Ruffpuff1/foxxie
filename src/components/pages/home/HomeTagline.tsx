import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';

export default function HomeTagline() {
    const [translations] = useLocale();

    return (
        <h4 className='text-center text-gray-700'>
            {translations.home.tag}{' '}
            <Link className='duration-200 hover:text-blue-500' href='/music'>
                {translations.home.musician}
            </Link>
            .
        </h4>
    );
}

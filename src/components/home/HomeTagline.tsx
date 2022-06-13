import useLocale from "../../hooks/useLocale";

export default function HomeTagline() {
    const [translations] = useLocale();

    return (
        <h4 className='text-center md:text-start md:ml-56 text-gray-700 duration-500'>
            {translations.home.tag} <a className="hover:text-blue-500 duration-500" href='https://ruffpuff.dev/music'>{translations.home.musician}</a>.
        </h4>
    );
}

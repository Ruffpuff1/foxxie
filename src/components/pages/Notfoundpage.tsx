import useLocale from "../../hooks/useLocale";
import HomeFooter from "../footer/HomeFooter";
import Navbar from "../nav/Navbar";

export default function Notfoundpage() {
    const [translations, hl] = useLocale();

    return (
        <>
            <Navbar />

            <div className='text-4xl font-bold md:text-6xl mt-56 flex items-center justify-center md:ml-20 md:justify-start'>
                404
            </div>
            <h4 className='text-center px-5 md:text-start md:ml-16 hover:text-gray-400 text-gray-700 duration-500'>
                <a href={hl && hl !== 'en_us' ? `/${hl}` : '/'}>
                    {translations.notFound.tag}
                </a>
            </h4>

            <HomeFooter />
        </>
    );
}

import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import FoxxieDiscordUI from '../../components/pages/foxxie/about/discord-ui/FoxxieDiscordUI';
import FoxxieFeaturesList from '../../components/pages/foxxie/about/discord-ui/FoxxieFeaturesList';
import Navbar from '../../components/pages/foxxie/about/ui/Navbar';
import useVisibility from '../../hooks/useVisibility';

const About: NextPage = () => {
    const [visible, atBottom, ref] = useVisibility<HTMLDivElement>();
    const router = useRouter();

    return (
        <div>
            <Navbar hide={visible} />

            <section className="h-[100vh] flex flex-col items-center xl:items-start justify-center">
                <div className="text-center mb-10 mx-10 space-y-5">
                    <h1 className="text-3xl">Building communities made easy</h1>
                    <h2 className='mt-3 text-center text-lg text-gray-600 xl:w-96 xl:text-left'>Moderation, information, and logging. All through one tool.</h2>
                </div>

                <button onClick={() => router.push('/community')} className='xl:hidden rounded-md bg-blue-500 p-3 text-white'>
                    Join the Server
                </button>
            </section>

            <section ref={ref} className=''>
                <FoxxieDiscordUI />
                <FoxxieFeaturesList />
            </section>

            <section className="h-[100vh]">

            </section>
        </div>
    );
};

export default About;

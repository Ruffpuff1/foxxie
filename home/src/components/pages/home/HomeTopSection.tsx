import HomeHeader from './HomeHeader';
import HomeTagline from './HomeTagline';

export default function HomeTopSection() {
    return (
        <section className='flex h-[900px] flex-col items-center justify-center'>
            <HomeHeader />
            <HomeTagline />
        </section>
    );
}

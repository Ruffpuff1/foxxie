import FeaturedProjects from './FeaturedProjects/FeaturedProjects';
import Header from './Header';

export default function WorkHeader() {
    return (
        <div className='mt-40 mb-56 md:mt-16'>
            <div className='flex flex-col items-center md:flex-row md:justify-evenly'>
                <Header />
                <FeaturedProjects />
            </div>
        </div>
    );
}

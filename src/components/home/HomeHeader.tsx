import HomeImage from './HomeImage';
import HomeName from './HomeName';

export default function HomeHeader() {
    return (
        <div className='mt-56 flex items-center justify-center md:ml-20 md:justify-start'>
            <HomeImage />
            <HomeName />
        </div>
    );
}

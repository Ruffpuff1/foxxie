import HomeImage from './HomeImage';
import HomeName from './HomeName';

export default function HomeHeader() {
    return (
        <div className='mt-24 flex flex-col items-center justify-center md:mt-56 md:ml-20 md:flex-row md:justify-start'>
            <HomeImage />
            <HomeName />
        </div>
    );
}

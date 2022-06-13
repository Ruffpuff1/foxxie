import HomeFooter from "../footer/HomeFooter";
import HomeHeader from "../home/HomeHeader";
import HomeSocials from "../home/HomeSocials";
import HomeTagline from "../home/HomeTagline";
import Navbar from "../nav/Navbar";

export default function Homepage() {
    return (
        <>
            <Navbar />

            <HomeHeader />
            <HomeTagline />
            <HomeSocials />

            <HomeFooter />
        </>
    );
}

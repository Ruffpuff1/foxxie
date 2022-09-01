import { Colors, Images } from '@assets/images';
import useLocale from '@hooks/useLocale';
import { DefaultSeoProps, RobotBlockingProps } from '@util/seoProps';
import { NextSeo } from 'next-seo';
import Head from 'next/head';

const DefaultImg: Img = {
    image: Images.Reese,
    alt: 'Me, Reese',
    format: 'image/jpeg'
};

export default function Meta({
    color,
    icon,
    image = icon ? { image: icon, alt: '', format: 'image/png' } : DefaultImg,
    noRobots,
    keywords,
    subject,
    title,
    description
}: Props) {
    const [, hl] = useLocale();

    return (
        <>
            <Head>
                <link rel='icon' href={icon || image.image} />
                <meta name='theme-color' content={color || Colors.RuffGray} />
            </Head>
            <NextSeo
                {...(noRobots
                    ? RobotBlockingProps(title, description, { image: image.image, alt: image.alt, format: image.format }, hl)
                    : DefaultSeoProps(
                          title,
                          description,
                          {
                              image: image.image,
                              alt: image.alt,
                              format: image.format
                          },
                          keywords!,
                          subject!,
                          hl
                      ))}
            />
        </>
    );
}

interface Props {
    noRobots?: boolean;
    title: string;
    icon?: string;
    description: string;
    image?: Img;
    keywords?: string[];
    subject?: string;
    color?: string;
}

interface Img {
    image: string;
    alt: string;
    format: string;
}

/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '../../assets/images';
import { useState } from 'react';
import { WebsiteType } from '../api/message';
import Head from 'next/head';
import HireMain from '../../components/pages/hire/HireMain';
import EmailStep from '../../components/pages/hire/steps/EmailStep';
import SiteTypeStep from '../../components/pages/hire/steps/SiteTypeStep';
import NameStep from '../../components/pages/hire/steps/NameStep';
import NumberPagesStep from '../../components/pages/hire/steps/NumberPagesStep';
import OtherDescriptionStep from '../../components/pages/hire/steps/OtherDescriptionStep';

const Hire: NextPage = () => {
    const [step, setStep] = useState('1');
    const [siteType, setSiteType] = useState<WebsiteType>(null!);
    const [description, setDescription] = useState('');

    const [email, setEmailValue] = useState('');
    const [name, setName] = useState('');
    const [numberPages, setNumberPages] = useState<`${number}`>(null!);

    const setEmail = (e: string) => {
        setEmailValue(e);
    };

    const setType = (v: WebsiteType) => {
        setSiteType(v);
        setStep('3');
    };

    const setPageNumbers = (page: `${number}`) => {
        setNumberPages(page);

        setStep('4');
    };

    const submitEmail = () => {
        setStep('5');
    };

    const submitDescription = async () => {
        await fetch('/api/message', {
            method: 'POST',
            body: JSON.stringify({
                name,
                body: description || 'n/a',
                email,
                type: siteType,
                numberOfPages: numberPages
            })
        });

        setStep('6');
    };

    const submitName = () => {
        setStep('2');
    };

    return (
        <>
            <Head>
                <link rel='icon' href={Images.Reese} />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>
            <NextSeo
                title='Hire Me - Reese Harlak'
                description=''
                openGraph={{
                    title: 'Hire Me - Reese Harlak',
                    description: ''
                }}
            />

            <HireMain className='mt-96'>
                <div>
                    <div className='mt-44'>
                        <div className='flex flex-col items-center'>
                            <h1 className={`text-3xl font-[450] duration-200 md:text-4xl ${step === '1' ? 'opacity-100' : 'opacity-0'}`}>Looking to hire me?</h1>
                            <h2 className='text-lg md:text-xl'>{getSubtitle(step)}</h2>
                        </div>

                        <div id='steps' className='fixed top-60 right-0 flex-grow overflow-hidden'>
                            <NameStep step={step} setName={setName} name={name} submitName={submitName} />
                            <SiteTypeStep step={step} setType={setType} />
                            <NumberPagesStep step={step} setNumberPages={setPageNumbers} />
                            <EmailStep step={step} email={email} submitEmail={submitEmail} setEmail={setEmail} />
                            <OtherDescriptionStep step={step} submitDescription={submitDescription} setDescription={setDescription} description={description} />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setStep((parseInt(step, 10) - 1).toString());
                        }}
                        className={`scale-btn absolute bottom-60 left-24 rounded-md border bg-gray-200 py-1 px-4 shadow-md duration-200 hover:shadow-xl ${
                            step === '1' ? 'scale-0' : 'scale-100'
                        }`}
                    >
                        Back
                    </button>
                </div>
            </HireMain>
        </>
    );
};

export default Hire;

function getSubtitle(step: string) {
    switch (step) {
        case '1':
            return 'Please enter your first and last name.';
        case '2':
            return 'What would you be looking for?';
        case '3':
            return 'How many pages would you want the site to have?';
        case '4':
            return 'Enter the best email to contact you with.';
        case '5':
            return 'Anything else I need to know?';
    }
}

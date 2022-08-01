import { DataType, dataFuzzySearch } from '@assets/arts-and-culture/data/searching';
import { Museum, Exhibit, Asset, PrideStory, Entity } from '@assets/arts-and-culture/structures';
import { useClickOutside } from '@ruffpuff/usehooks';
import React, { useState } from 'react';
import {
    MdArrowBack,
    MdAutoAwesome,
    MdClose,
    MdLocationOn,
    MdOutlineAccountBalance,
    MdOutlineAccountCircle,
    MdOutlineLooks,
    MdOutlinePhoto,
    MdOutlineWallpaper
} from 'react-icons/md';

export default function Search({ show, setShow }: Props) {
    const [value, setValue] = useState('');
    const result = value.length < 2 ? [] : dataFuzzySearch.runFuzzy(value).slice(0, 9);

    const [ref] = useClickOutside<HTMLDivElement>(() => {
        if (show) setShow(false);
    });

    return (
        <div className={`fixed z-[60] h-full w-full bg-black duration-200 ${show ? 'bg-opacity-50' : 'hidden bg-opacity-0'}`}>
            <div ref={ref} className={`fixed z-[70] w-full bg-white py-4 duration-200 ease-in-out ${show ? 'top-0' : 'top-[-5rem]'}`}>
                <div className='flex items-center justify-between'>
                    <div className='flex w-full items-center shadow-md'>
                        <div className='flex h-[56px] items-center'>
                            <button
                                onClick={() => {
                                    setShow(false);
                                }}
                                className='ml-3 flex h-12 w-12 items-center justify-center rounded-full text-[#80868b] active:bg-gray-200'
                            >
                                <MdArrowBack className='text-2xl' />
                            </button>
                        </div>

                        <input
                            type='text'
                            placeholder='Search'
                            className='h-[56px] w-full border-none px-[36px] text-[1rem] font-[500] text-[#80868b]'
                            onChange={e => {
                                setValue(e.target.value);
                            }}
                        />

                        <div className='flex h-[56px] items-center'>
                            {result.length > 0 && (
                                <button
                                    onClick={() => {
                                        setShow(false);
                                    }}
                                    className='mr-3 flex h-12 w-12 items-center justify-center rounded-full text-[#80868b] active:bg-gray-200'
                                >
                                    <MdClose className='text-2xl' />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`max-h-[calc(100vh-56px)] w-full overflow-y-auto shadow-md duration-100 h-[${56 * result.length}px] ${
                        result.length > 0 && show ? 'opacity-100' : 'h-0 opacity-0'
                    }`}
                >
                    <div className='w-full text-[16px] font-[400] text-[#202124]'>
                        <ul className='block text-[16px]'>
                            {result.map(res => {
                                return (
                                    <li key={res.id} className=''>
                                        <a
                                            href={res.page}
                                            className='flex h-[56px] w-full cursor-pointer items-center space-x-5 overflow-hidden text-ellipsis whitespace-nowrap pl-[1.25rem] pr-[12px] align-middle text-[1rem] font-[500] leading-[56px] text-[#80868b] hover:bg-slate-100'
                                        >
                                            {getIcon(res)}

                                            <span>{res.name}</span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getIcon(result: DataType) {
    if (result instanceof Museum) return <MdOutlineAccountBalance className='text-2xl text-[#80868b]' />;
    if (result instanceof Exhibit) return <MdOutlineWallpaper className='text-2xl text-[#80868b]' />;
    if (result instanceof Asset) return <MdOutlinePhoto className='text-2xl text-[#80868b]' />;
    if (result instanceof PrideStory) return <MdOutlineLooks className='text-2xl text-[#80868b]' />;
    if (result instanceof Entity && (result.type === 'person' || result.type === 'figure')) return <MdOutlineAccountCircle className='text-2xl text-[#80868b]' />;
    if (result instanceof Entity && result.type === 'location') return <MdLocationOn className='text-2xl text-[#80868b]' />;
}

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
}

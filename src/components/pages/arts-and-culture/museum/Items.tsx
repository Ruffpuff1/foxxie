import { Asset } from '@assets/arts-and-culture/structures';
import { chunk } from '@ruffpuff/utilities';

export default function Items({ art, title }: { art: Asset[]; title?: string }) {
    if (!art.length) return null;

    return (
        <div className='mb-20 w-full'>
            <div className='mb-5 px-5 text-lg tracking-wide text-gray-500 md:px-28'>{title ? <h2>{title}</h2> : <h2>{art.length} Items</h2>}</div>

            <span className='box-border block min-h-[300px] w-full'>
                <div className='box-border block'>
                    <div className='relative box-border block w-full max-w-none overflow-hidden'>
                        <div className='box-border block min-w-full overflow-x-auto overflow-y-hidden whitespace-nowrap p-0'>
                            <span className='box-border whitespace-nowrap'>
                                {chunk(art, 4).map((chunk, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            className='no-scroll relative box-border inline-block w-[40%] max-w-[40vh] overflow-hidden whitespace-normal align-top'
                                        >
                                            {chunk.map(a => {
                                                return (
                                                    <div
                                                        key={a.id}
                                                        className={`relative mx-[2px] my-[4px] box-border block w-[calc(50%-4px)] whitespace-normal duration-200 odd:float-left even:float-right`}
                                                        style={{
                                                            backgroundColor: a.bgColor
                                                        }}
                                                    >
                                                        <a
                                                            href={`/arts-and-culture/asset/${a.id}`}
                                                            className='relative block w-full bg-cover bg-top bg-no-repeat pt-[calc(100%+1.6px)]'
                                                            style={{
                                                                backgroundImage: `url('${a.image}')`
                                                            }}
                                                        >
                                                            <span className='box-border'></span>
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    );
}

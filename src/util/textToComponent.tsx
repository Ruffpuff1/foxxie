import { entities, museums } from '@assets/arts-and-culture/data';
import { Entity, Nasa, Photograph, Sculpture } from '@assets/arts-and-culture/structures';

export function textToComponent(text: string, entity: Entity | Nasa | Photograph | Sculpture) {
    if (!text) return null;

    const description = text.split('\n\n');
    const links = new Set();

    return description.map((t, idx) => {
        return (
            <span key={t}>
                {t.split(' ').map(text => {
                    if (text.endsWith('.')) {
                        const cleaned = text.replace(/.$/, '');
                        const e = entities.find(e => e.name.toLowerCase() === cleaned.toLowerCase());
                        const m = museums.find(m => m.name.toLowerCase() === cleaned.toLowerCase());

                        if (e && e.name !== entity.name && !links.has(e.id.toLowerCase())) {
                            links.add(e.id.toLowerCase());

                            return (
                                <a href={e.page} key={e.id}>
                                    <span className='text-blue-500'>{`${cleaned}. `}</span>
                                </a>
                            );
                        }

                        if (m && !links.has(m.id.toLowerCase())) {
                            links.add(m.id.toLowerCase());

                            return (
                                <a href={m.page} key={m.id}>
                                    <span className='text-blue-500'>{`${cleaned}. `}</span>
                                </a>
                            );
                        }

                        return (
                            <>
                                {cleaned}
                                {'. '}
                            </>
                        );
                    }

                    if (text.endsWith(',')) {
                        const cleaned = text.replace(/,$/, '');
                        const e = entities.find(e => e.name.toLowerCase() === cleaned.toLowerCase());
                        const m = museums.find(m => m.name.toLowerCase() === cleaned.toLowerCase());

                        if (e && e.name !== entity.name && !links.has(e.id.toLowerCase())) {
                            links.add(e.id.toLowerCase());

                            return (
                                <a href={e.page} key={e.id}>
                                    <span className='text-blue-500'>{`${cleaned}, `}</span>
                                </a>
                            );
                        }

                        if (m && !links.has(m.id.toLowerCase())) {
                            links.add(m.id.toLowerCase());

                            return (
                                <a href={m.page} key={m.id}>
                                    <span className='text-blue-500'>{`${cleaned}, `}</span>
                                </a>
                            );
                        }

                        return <>{`${cleaned}, `}</>;
                    }

                    const e = entities.find(e => e.name.toLowerCase() === text.toLowerCase());

                    if (e && e.name !== entity.name && !links.has(e.id.toLowerCase())) {
                        links.add(e.id.toLowerCase());

                        return (
                            <a href={e.page}>
                                <span className='text-blue-500'>{`${text} `}</span>
                            </a>
                        );
                    }

                    return <>{`${text} `}</>;
                })}

                {idx !== description.length && description.length !== 1 && (
                    <>
                        <br />
                        <br />
                    </>
                )}
            </span>
        );
    });
}

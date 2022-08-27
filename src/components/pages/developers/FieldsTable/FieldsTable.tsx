import { ReactNode } from 'react';

export default function FieldsTable({ fields }: { fields: Field[] }) {
    return (
        <table className='mt-10 w-full'>
            <thead className='border-b-2 border-gray-300 md:border-b'>
                <tr className='flex h-10 items-center justify-start bg-gray-200 px-2 text-sm font-[500]'>
                    <td>Fields</td>
                </tr>
            </thead>
            <tbody>
                {fields.map(field => {
                    return (
                        <tr key={field.key} id={`villager-${field.key}`} className='flex flex-col justify-start border-b bg-gray-100 md:flex-row md:items-center md:pl-2'>
                            <td className='flex w-40 items-start py-2 pl-2 text-xs md:py-0 md:pl-0'>
                                <code>{field.key}</code>
                            </td>
                            <td className='flex w-full flex-col items-start justify-between space-y-1 bg-white px-2 py-3 text-sm'>
                                {field.type && (
                                    <span>
                                        <code>{field.type}</code>
                                    </span>
                                )}
                                <span>{field.description}</span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export interface Field {
    key: string;
    type?: string | ReactNode;
    description: string | ReactNode;
}

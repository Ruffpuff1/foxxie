import { useRouter } from 'next/router';
import React from 'react';

export default function JoinServerButton() {
    const router = useRouter();

    return (
        <button onClick={() => router.push('/community')} className='mb-10 rounded-md bg-blue-500 py-3 px-6 text-white'>
            Join the Server
        </button>
    );
}

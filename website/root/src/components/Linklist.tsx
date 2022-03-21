import { useRouter } from "next/router";

export function Linklist({ name }: { name: string; }) {
    const router = useRouter();
    return (
        <ul className='flex space-x-4 text-white'>
            {
                router.pathname === `/${name}`
                    ?
                    <>
                        <li>
                            <a href={`/${name}/invite`}>Invite</a>
                        </li>
                        <li>
                            <a href={`/${name}/commands`}>Commands</a>
                        </li>
                    </>
                    : router.pathname === `/${name}/invite`
                        ?
                        <>
                            <li>
                                <a href={`/${name}`}>Home</a>
                            </li>
                            <li>
                                <a href={`/${name}/commands`}>Commands</a>
                            </li>
                        </>
                        : <>
                            <li>
                                <a href={`/${name}`}>Home</a>
                            </li>
                            <li>
                                <a href={`/${name}/invite`}>Invite</a>
                            </li>
                        </>
            }
        </ul>
    );
}

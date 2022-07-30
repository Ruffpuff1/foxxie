import { useRouter } from 'next/router';
import { useContext, useState, useEffect, ReactNode, createContext } from 'react';

export const IdContext = createContext<{ id: string | null; routeId: (id: string) => Promise<boolean> }>({
    id: null,
    routeId: async (e: string) => {
        return true as unknown as Promise<boolean>;
    }
});

export function IdProvider({ children }: { children: ReactNode }) {
    const router = useRouter();

    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        if (router.query.id) setId(router.query.id as string);
    }, [router.query.id]);

    const routeId = (id: string) => router.push(router.pathname, { query: { id } }, { shallow: true });

    return <IdContext.Provider value={{ id, routeId }}>{children}</IdContext.Provider>;
}

export default function useId(): [string | null, (id: string) => Promise<boolean>] {
    const { id, routeId } = useContext(IdContext);
    return [id, routeId];
}

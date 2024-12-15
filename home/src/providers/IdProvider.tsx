import { useQuery } from '@reeseharlak/usehooks';
import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext } from 'react';

export const IdContext = createContext<{ id: string | null; routeId: (id: string) => Promise<boolean> }>({
    id: null,
    routeId: async (e: string) => {
        return true as unknown as Promise<boolean>;
    }
});

export function IdProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const id = useQuery('id');

    const routeId = (i: string) => router.push(router.pathname, { query: { id: i } }, { shallow: true });

    return <IdContext.Provider value={{ id, routeId }}>{children}</IdContext.Provider>;
}

export default function useId(): [string | null, (id: string) => Promise<boolean>] {
    const { id, routeId } = useContext(IdContext);
    return [id, routeId];
}

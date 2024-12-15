import { useState, ReactNode, createContext, useMemo } from 'react';

interface Context {
    showRename: boolean;
    setShowRename: (id: boolean) => void;
}

export const FileModalContext = createContext<Context>({
    showRename: false,
    setShowRename: (e: boolean) => {
        /** */
    }
});

export function FileModalProvider({ children }: { children: ReactNode }) {
    const [showRename, setShowRename] = useState(false);

    const ctx = useMemo(
        () => ({
            showRename,
            setShowRename
        }),
        [showRename]
    );

    return <FileModalContext.Provider value={ctx}>{children}</FileModalContext.Provider>;
}

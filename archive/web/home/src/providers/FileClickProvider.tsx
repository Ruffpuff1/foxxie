import { createContext, ReactNode, useMemo, useState } from 'react';
import type { File } from '../hooks/useFolder';

const baseFile: File = {
    folderId: '',
    name: '',
    id: null,
    url: '',
    userId: ''
};

export const FileClickContext = createContext({
    showDetails: false,
    selected: 0,
    setShowDetails: (b: boolean) => {
        /* */
    },
    file: baseFile,
    setSelected: (n: number) => {
        /* */
    },
    setFile: (f: File) => {
        /* */
    }
});

export function FileClickProvider({ children }: { children: ReactNode }) {
    const [showDetails, setShowDetails] = useState(false);
    const [file, setFile] = useState(baseFile);
    const [selected, setSelected] = useState(0);

    const ctx = useMemo(
        () => ({
            showDetails,
            setShowDetails,
            file,
            setFile,
            selected,
            setSelected
        }),
        [showDetails, file, selected]
    );

    return <FileClickContext.Provider value={ctx}>{children}</FileClickContext.Provider>;
}

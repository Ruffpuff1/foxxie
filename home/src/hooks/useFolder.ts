import { database } from '@util/firebase';
import { doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useReducer } from 'react';
import { useAuth } from './useAuth';

export const RootFolder: Folder = {
    name: 'Root',
    id: null,
    color: null,
    userId: null!,
    path: [],
    sharedUsers: [],
    parentId: null
};

function reducer(state: Payload, { type, payload }: { type: Actions; payload: Payload }) {
    switch (type) {
        case Actions.SelectFolder:
            return {
                folderId: payload.folderId,
                folder: payload.folder,
                childFiles: [],
                childFolders: [],
                sharedFolders: []
            };
        case Actions.UpdateFolder:
            return {
                ...state,
                folder: payload.folder
            };
        case Actions.SetChildFolders:
            return {
                ...state,
                childFolders: payload.childFolders
            };
        case Actions.SetChildFiles:
            return {
                ...state,
                childFiles: payload.childFiles
            };
        case Actions.SetSharedFolders:
            return {
                ...state,
                sharedFolders: payload.sharedFolders
            };
        case Actions.SetSharedFiles:
            return {
                ...state,
                sharedFiles: payload.sharedFiles
            };
        default: {
            return state;
        }
    }
}

const enum Actions {
    SelectFolder = 'select',
    UpdateFolder = 'update',
    SetChildFolders = 'set-child-folders',
    SetChildFiles = 'set-child-files',
    SetSharedFolders = 'set-shared-folders',
    SetSharedFiles = 'set-shared-files'
}

interface Payload {
    folderId?: string | null;
    folder?: Folder | null;
    childFolders?: Folder[];
    sharedFolders?: Folder[];
    childFiles?: File[];
    sharedFiles?: File[];
}

export interface Folder {
    name: string;
    id: string | null;
    parentId: null | string;
    userId: string;
    color: null | string;
    path: FolderPath[];
    sharedUsers: string[];
}

export interface File {
    folderId: string;
    name: string;
    id: string | null;
    url: string;
    userId: string;
}

export interface FolderPath {
    name: string;
    id: string | null;
}

export type State = Required<Payload>;

export function useFolder(folderId: string | null = null, folder: Folder | null = null): [State] {
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: [],
        sharedFolders: [],
        sharedFiles: []
    });
    const [user] = useAuth();
    const id = user?.uid || null;

    useEffect(() => {
        dispatch({ type: Actions.SelectFolder, payload: { folderId, folder } });
    }, [folderId, folder]);

    useEffect(() => {
        if (folderId === null) {
            dispatch({
                type: Actions.UpdateFolder,
                payload: { folder: RootFolder }
            });
            return;
        }

        getDoc(doc(database.store, `folders/${folderId}`))
            .then(doc => {
                const formatted = database.doc(doc);

                dispatch({
                    type: Actions.UpdateFolder,
                    payload: { folder: formatted as Folder }
                });
            })
            .catch(() => {
                dispatch({
                    type: Actions.UpdateFolder,
                    payload: { folder: RootFolder }
                });
            });
    }, [folderId]);

    useEffect(() => {
        const q = query(database.folders, where('parentId', '==', folderId), where('userId', '==', id), orderBy('createdAt'));

        return onSnapshot(q, {
            next: snapshot => {
                dispatch({
                    type: Actions.SetChildFolders,
                    payload: {
                        childFolders: snapshot.docs.map(database.doc)
                    }
                });
            }
        });
    }, [folderId, id]);

    useEffect(() => {
        const q = query(database.files, where('folderId', '==', folderId));

        return onSnapshot(q, {
            next: snapshot => {
                dispatch({
                    type: Actions.SetSharedFiles,
                    payload: {
                        sharedFiles: folder?.sharedUsers?.includes(id!) ? snapshot.docs.map(database.file) : undefined
                    }
                });
            }
        });
    }, [folderId, id, folder?.sharedUsers]);

    useEffect(() => {
        const q = query(database.files, where('folderId', '==', folderId), where('userId', '==', id || null), orderBy('createdAt'));

        return onSnapshot(q, {
            next: snapshot => {
                dispatch({
                    type: Actions.SetChildFiles,
                    payload: {
                        childFiles: snapshot.docs.map(database.file)
                    }
                });
            }
        });
    }, [folderId, user, id]);

    useEffect(() => {
        const q = query(database.folders, where('parentId', '==', folderId), where('sharedUsers', 'array-contains', id));

        return onSnapshot(q, {
            next: snapshot => {
                dispatch({
                    type: Actions.SetSharedFolders,
                    payload: {
                        sharedFolders: snapshot.docs.map(database.doc)
                    }
                });
            }
        });
    }, [folderId, user, id]);

    return [state as State];
}

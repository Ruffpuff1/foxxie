import { File, Folder } from '@hooks/useFolder';
import { TodoList, TodoTask } from '@hooks/useTodo';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signOut as signOutFirebase } from 'firebase/auth';
import { getFirestore, collection, serverTimestamp, DocumentSnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyCkUPnMTF8EDKFcALMQzrUnWn1Yl46z8-8',
    authDomain: 'reese-7fee7.firebaseapp.com',
    projectId: 'reese-7fee7',
    storageBucket: 'gs://reese-7fee7.appspot.com/',
    messagingSenderId: '106097519808',
    appId: '1:106097519808:web:d9288b968047886843d125'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const store = getFirestore(app);

export const GoogleAuth = new GoogleAuthProvider();
GoogleAuth.setCustomParameters({
    login_hint: 'reese@ruffpuff.dev'
});

export const database = {
    folders: collection(store, 'folders'),
    files: collection(store, 'files'),
    todos: collection(store, 'todo'),
    todoLists: collection(store, 'todolists'),
    users: collection(store, 'users'),
    getTimestamp: serverTimestamp,
    store,
    list: (doc: DocumentSnapshot) => {
        return { id: doc.id, ...doc.data() } as TodoList;
    },
    todo: (doc: DocumentSnapshot) => {
        return { id: doc.id, ...doc.data() } as TodoTask;
    },
    doc: (doc: DocumentSnapshot) => {
        return { id: doc.id, ...doc.data() } as Folder;
    },
    file: (doc: DocumentSnapshot) => {
        return { id: doc.id, ...doc.data() } as File;
    }
};

export const storage = getStorage(app);
export const auth = getAuth(app);

export const signOut = async () => {
    await signOutFirebase(auth);

    auth.onAuthStateChanged(() => {
        window.location.href = '/';
    });
};

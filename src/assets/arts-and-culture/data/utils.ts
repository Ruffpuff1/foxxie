import { museums } from './groups';

export const findMuseumFromId = (id: string) => {
    return museums.find(m => m.id === id);
};

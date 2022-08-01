import { Photograph } from '@assets/arts-and-culture/structures/Photograph';
import { searchTerms } from '../searching';
import data from './Photographs.json';

export const photographs: Photograph[] = [];

for (const photographData of data.photographs) {
    const photograph = new Photograph(photographData as Photograph);
    photographs.push(photograph);
    searchTerms.set(photograph.name, photograph);
}

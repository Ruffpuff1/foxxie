import { Sculpture } from '@assets/arts-and-culture/structures';
import { searchTerms } from '../searching';
import data from './Sculptures.json';

export const sculptures: Sculpture[] = [];

for (const photographData of data.sculptures) {
    const sculpture = new Sculpture(photographData as Sculpture);
    sculptures.push(sculpture);
    searchTerms.set(sculpture.name, sculpture);
}

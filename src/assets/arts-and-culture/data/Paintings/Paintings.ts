import { Painting } from '@assets/arts-and-culture/structures';
import { searchTerms } from '../searching';
import data from './Paintings.json';

export const paintings: Painting[] = [];

for (const paintingData of data.paintings) {
    const painting = new Painting(paintingData as Painting);
    paintings.push(painting);
    searchTerms.set(painting.name, painting);
}

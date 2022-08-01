import { Nasa } from '@assets/arts-and-culture/structures/Nasa';
import { searchTerms } from '../searching';
import data from './Nasas.json';

export const nasas: Nasa[] = [];

for (const nasaData of data.nasas) {
    const nasa = new Nasa(nasaData as Nasa);
    nasas.push(nasa);
    searchTerms.set(nasa.name, nasa);
}

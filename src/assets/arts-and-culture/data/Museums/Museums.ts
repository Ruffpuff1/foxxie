import { Museum } from '../../structures/Museum';
import { museums } from '../groups';
import { searchTerms } from '../searching';
import data from './Museums.json';

for (const museumData of data.museums) {
    const museum = new Museum(museumData as Museum);
    museums.push(museum);
    searchTerms.set(museum.name, museum);
}

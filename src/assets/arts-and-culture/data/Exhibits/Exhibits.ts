import { Exhibit } from '../../structures/Exhibit';
import { exhibits } from '../groups';
import { searchTerms } from '../searching';
import data from './Exhibits.json';

for (const exhibitData of data.exhibits) {
    const exhibit = new Exhibit(exhibitData as Exhibit);
    exhibits.push(exhibit);
    searchTerms.set(exhibit.name, exhibit);
}

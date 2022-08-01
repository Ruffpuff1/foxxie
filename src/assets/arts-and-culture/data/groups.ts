import { Exhibit, Museum } from '../structures';
import { entities } from './Entities/Entities';
import { nasas } from './Nasas/Nasas';
import { paintings } from './Paintings/Paintings';
import { photographs } from './Photographs/Photographs';
import { prideStories } from './PrideStories/PrideStories';
import { sculptures } from './Sculptures/Sculptures';

const museums: Museum[] = [];
const exhibits: Exhibit[] = [];

const assets = [...nasas, ...photographs, ...sculptures, ...paintings];
const storys = [...prideStories];

export { museums, exhibits, assets, sculptures, storys, nasas, paintings, entities, photographs, prideStories };

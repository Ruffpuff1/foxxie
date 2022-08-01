import { FuzzySearch } from 'src/util/FuzzySearch';
import { Entity, Exhibit, Museum, Nasa, Painting, Photograph, PrideStory, Sculpture, Story } from '../structures';

export type DataType = Museum | Sculpture | Exhibit | PrideStory | Story | Nasa | Photograph | Entity | Painting;
export const searchTerms = new Map<string, DataType>();

export const dataFuzzySearch = new FuzzySearch(searchTerms, ['name']);

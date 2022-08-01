import { PrideStory } from '@assets/arts-and-culture/structures/PrideStory';
import { searchTerms } from '../searching';
import data from './PrideStories.json';

export const prideStories: PrideStory[] = [];

for (const prideStoryData of data.prideStories) {
    const prideStory = new PrideStory(prideStoryData as PrideStory);
    prideStories.push(prideStory);
    searchTerms.set(prideStory.name, prideStory);
}

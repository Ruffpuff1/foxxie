import { Story } from '@assets/arts-and-culture/structures';
import { searchTerms } from '../searching';
import data from './Stories.json';

export const stories: Story[] = [];

for (const storyData of data.stories) {
    const story = new Story(storyData as Story);
    stories.push(story);
    searchTerms.set(story.name, story);
}

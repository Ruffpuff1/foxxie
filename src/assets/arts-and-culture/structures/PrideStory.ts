import { Story } from './Story';

export class PrideStory extends Story implements PrideStory {
    public constructor(data: PrideStory) {
        super(data);
    }
}

export interface PrideStory {}

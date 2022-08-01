import MlmPrideParallax from '@arts-culture/story/mlm-pride/MlmPrideParallax';
import { Story } from '@assets/arts-and-culture/structures';

export const StoryComponents = new Map<string, ({ story }: { story: Story }) => JSX.Element>([['mlm-pride', MlmPrideParallax]]);

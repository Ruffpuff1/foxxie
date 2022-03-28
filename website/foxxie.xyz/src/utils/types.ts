export interface TermsSection {
    heading: string;
    body: string;
    extra?: string;
}

export type BotName = 'kettu' | 'foxxie';
export type BotTag = 'Moderation' | 'Tools';

export interface Bot {
    name: string;
    tag: BotTag;
    color: `bg-${string}`;
    image: `https://cdn.ruffpuff.dev/${BotName}.png`;
    text: string;
    link: '' | `/${BotName}/invite` | `/${BotName}`;
    hidden: boolean;
}

import { cast } from '@ruffpuff/utilities';
import { NextApiRequest, NextApiResponse } from 'next';
import { fetch, HttpMethodEnum } from '@foxxie/fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ data: 'Method not allowed' });
        return;
    }

    const incoming = cast<Body>(JSON.parse(req.body));
    if (!incoming) return res.status(406);

    const result = await fetch(process.env.WEBHOOK_URL!, HttpMethodEnum.Post) //
        .body({
            embeds: [
                {
                    author: {
                        name: `💬 / ${incoming.name} (${incoming.email})`
                    },
                    fields: [
                        {
                            name: ':mouse_three_button: Type',
                            value: incoming.type,
                            inline: true
                        },
                        {
                            name: ':book: Pages',
                            value: incoming.numberOfPages,
                            inline: true
                        },
                        {
                            name: ':inbox_tray: Other',
                            value: `\`\`\`${incoming.body}\`\`\``
                        }
                    ],
                    color: 3092790,
                    timestamp: new Date().toISOString()
                }
            ]
        })
        .json()
        .catch(() => null);

    if (result === null) {
        res.json({
            result: 'success'
        });

        return;
    }

    console.log(result);

    res.json(result);
}

export interface Body {
    name: string;
    body: string;
    email: string;
    type: WebsiteType;
    numberOfPages: `${number}`;
}

export type WebsiteType = 'static' | 'dynamic';

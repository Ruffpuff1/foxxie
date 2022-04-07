/**
 * Copyright 2019-2021 Antonio Román
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { noop } from '@sapphire/utilities';
import type { Guild, User } from 'discord.js';
import { minutes } from './common';

export type LongLivingReactionCollectorListener = (reaction: LLRCData) => void;

export class LongLivingReactionCollector {

    public listener: LongLivingReactionCollectorListener | null;
    public endListener: (() => void) | null;

    private _timer: NodeJS.Timeout | null = null;

    public constructor(listener: LongLivingReactionCollectorListener | null = null, endListener: (() => void) | null = null) {
        this.listener = listener;
        this.endListener = endListener;
        container.client.llrCollectors.add(this);
    }

    public setListener(listener: LongLivingReactionCollectorListener | null) {
        this.listener = listener;
        return this;
    }

    public setEndListener(listener: () => void) {
        this.endListener = listener;
        return this;
    }

    public get ended(): boolean {
        return !container.client.llrCollectors.has(this);
    }

    public send(reaction: LLRCData): void {
        if (this.listener) this.listener(reaction);
    }

    public setTime(time: number) {
        if (this._timer) clearTimeout(this._timer);
        if (time === -1) this._timer = null;
        else this._timer = setTimeout(() => this.end(), time);
        return this;
    }

    public end() {
        if (!container.client.llrCollectors.delete(this)) return this;

        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        if (this.endListener) {
            process.nextTick(this.endListener.bind(null));
            this.endListener = null;
        }
        return this;
    }

    public static collectOne({ filter = () => true, time = minutes(5) }: LLRCCollectOneOptions = {}) {
        return new Promise<LLRCData | null>(resolve => {
            const llrc = new LongLivingReactionCollector(
                reaction => {
                    if (filter(reaction)) {
                        resolve(reaction);
                        llrc.setEndListener(noop).end();
                    }
                },
                () => {
                    resolve(null);
                }
            ).setTime(time);
        });
    }

}

export interface LLRCCollectOneOptions {
    filter?: (reaction: LLRCData) => boolean;
    time?: number;
}

export interface LLRCDataEmoji {
    animated: boolean;
    id: string | null;
    managed: boolean | null;
    name: string | null;
    requireColons: boolean | null;
    roles: string[] | null;
    user: User | { id: string };
}

export interface LLRCData {
    channel: GuildTextBasedChannelTypes;
    emoji: LLRCDataEmoji;
    guild: Guild;
    messageId: string;
    userId: string;
}
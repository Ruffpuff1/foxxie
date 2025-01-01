/**
 * Copyright 2022 Skyra Project

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
export const ansiRegExp = new RegExp(
    [
        String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*`,
        String.raw`[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
        String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`
    ].join('|'),
    'g'
);

export function escapedLength(line: string) {
    return line.replaceAll(ansiRegExp, '').length;
}

export function generateLineData(lines: readonly string[]): readonly LineData[] {
    return lines.map(line => ({ line, length: escapedLength(line) }));
}

export interface LineData {
    line: string;
    length: number;
}

export function generateFrameData(lines?: readonly string[]): FrameData {
    if (!lines?.length) return { length: 0, lines: [] };

    const entries = generateLineData(lines);
    const length = entries.reduce((prev, entry) => Math.max(prev, entry.length), 0);
    return {
        length,
        lines: entries.map(entry => `${entry.line}${' '.repeat(length - entry.length)}`)
    };
}

export interface FrameData {
    length: number;
    lines: readonly string[];
}

export function createBanner(options: BannerOptions) {
    const logoHeight = options.logo?.length ?? 0;
    const nameHeight = options.name?.length ?? 0;
    const extraHeight = options.extra?.length ?? 0;
    const detailsHeight = nameHeight + extraHeight;

    const fullHeight = Math.max(logoHeight, detailsHeight);

    // If there's no content at all, throw an error
    if (fullHeight === 0) throw new Error('Expected any of the options to be passed');

    // If there's no logo, display details only:
    if (logoHeight === 0) return [...(options.name ?? []), ...(options.extra ?? [])].join('\n');

    // If there are no details, display logo only:
    if (detailsHeight === 0) return options.logo!.join('\n');

    const logoFrame = generateFrameData(options.logo);
    if (logoFrame.length === 0) return [...(options.name ?? []), ...(options.extra ?? [])].join('\n');

    const logoPadding = ' '.repeat(logoFrame.length);

    const lines: string[] = [];
    for (let i = 0, nl = 0, el = 0; i < fullHeight; ++i) {
        const left = i < logoHeight ? logoFrame.lines[i] : logoPadding;
        const right = nl < nameHeight ? options.name![nl++] : el < extraHeight ? options.extra![el++] : '';
        lines.push(right.length === 0 ? left.trimEnd() : `${left} ${right}`);
    }

    return lines.join('\n');
}

export interface BannerOptions {
    logo?: readonly string[];
    name?: readonly string[];
    extra?: readonly string[];
}

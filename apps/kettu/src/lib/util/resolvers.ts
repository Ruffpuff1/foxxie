import { LanguageKeys } from '#lib/i18n';
import type { TFunction } from '@foxxie/i18n';
import type { CommandInteraction } from 'discord.js';
import tinycolor from 'tinycolor2';
import { fetch } from '@foxxie/fetch';

export async function resolveColorArgument(colorArg: string, t: TFunction, interaction: CommandInteraction): Promise<tinycolor.Instance> {
    let color: tinycolor.Instance;
    const random = t(LanguageKeys.Commands.Tools.ColorRandom);
    const dominant = t(LanguageKeys.Commands.Tools.ColorDominant);

    if (colorArg.toLowerCase() === random) color = tinycolor.random();
    else if (colorArg.toLowerCase() === dominant) {
        const dom = await fetch('https://color.aero.bot') //
            .path('dominant') //
            .query('image', interaction.user.avatarURL()!) //
            .text();

        color = tinycolor(dom);
    } else {
        color = tinycolor(colorArg);
    }

    return color;
}

import { languageKeys } from '../lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';
import tinycolor from 'tinycolor2';
import type { ColorData } from '../lib/types/Augments';

export default class extends Argument<ColorData> {

    public async run(parameter: string, context: ArgumentContext): Promise<Result<ColorData, UserError>> {
        const you = context.args.t(languageKeys.globals.you);
        const me = context.args.t(languageKeys.globals.me);

        if (parameter === 'random') {
            const random = tinycolor.random();

            const obj = {
                hex: random.toHex(),
                rgb: random.toRgbString(),
                hsv: random.toHsvString(),
                hsl: random.toHslString()
            };

            return this.ok(obj);
        } else if (parameter === you) {
            const you = tinycolor(context.message.guild?.me?.displayHexColor);

            const obj = {
                hex: you.toHex(),
                rgb: you.toRgbString(),
                hsv: you.toHsvString(),
                hsl: you.toHslString()
            };

            return this.ok(obj);
        } else if (parameter === me) {
            const me = tinycolor(context.message.member?.displayHexColor);

            const obj = {
                hex: me.toHex(),
                rgb: me.toRgbString(),
                hsv: me.toHsvString(),
                hsl: me.toHslString()
            };

            return this.ok(obj);
        }

        const colorData = tinycolor(parameter);
        if (colorData.isValid()) {
            const obj = {
                hex: colorData.toHex(),
                rgb: colorData.toRgbString(),
                hsv: colorData.toHsvString(),
                hsl: colorData.toHslString()
            };

            return this.ok(obj);
        }

        return this.error({ parameter, identifier: languageKeys.arguments.invalidColor, context: { ...context, color: parameter } });
    }

}
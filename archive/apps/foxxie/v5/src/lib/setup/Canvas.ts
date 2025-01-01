import { assetsFolder } from '#utils/constants';
import { registerFont } from 'canvas-constructor/skia';
import { join } from 'node:path';

registerFont('RobotoSlab', [join(assetsFolder, 'fonts', 'RobotoSlab-VariableFont_wght.ttf')]);
registerFont('Cousine-Bold', [join(assetsFolder, 'fonts', 'Cousine-Bold.ttf')]);
registerFont('RobotoRegular', [join(assetsFolder, 'fonts', 'Roboto-Regular.ttf')]);
registerFont('RobotoLight', [join(assetsFolder, 'fonts', 'Roboto-Light.ttf')]);

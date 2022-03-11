import typescript from 'rollup-plugin-typescript2';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const dir = new URL('generated/', root);

const tsconfigFile = new URL('tsconfig.json', root);
const inputFile = new URL('stardrop.ts', dir);
const cjsOutputFile = new URL('stardrop.cjs', dir);
const mjsOutputFile = new URL('stardrop.mjs', dir);

export default {
    input: fileURLToPath(inputFile),
    output: [
        {
            file: fileURLToPath(cjsOutputFile),
            format: 'cjs',
            exports: 'named',
            sourcemap: true
        },
        {
            file: fileURLToPath(mjsOutputFile),
            format: 'es',
            exports: 'named',
            sourcemap: true
        }
    ],
    plugins: [typescript({ tsconfig: fileURLToPath(tsconfigFile) })]
};

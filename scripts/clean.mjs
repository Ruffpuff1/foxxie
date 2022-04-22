import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { green, gray, blue, yellow } from 'colorette';
import { execSync } from 'node:child_process';

/**
 * Clean a directories node_modules directory.
 * @param {string} directory
 */
function cleanPackages(directory) {
    const packagesPath = join(process.cwd(), directory);
    const arr = readdirSync(packagesPath).filter(dir => !dir.startsWith('.') && !dir.endsWith('.md') && !['localizations', 'parsers'].includes(dir));

    // @ts-expect-error intl listformat isn't typed.
    const list = new Intl.ListFormat('en-US', { type: 'conjunction' }).format(arr);

    console.info(`${blue('➤')} ${gray('clean:')} Attempting to clean director${arr.length !== 1 ? 'ies' : 'y'}: ${green(list)}`);

    let i = 0;

    for (const dir of arr) {
        execSync(`rm -rf ${directory}/${dir}/node_modules`);

        const first = i === 0;
        const last = i === arr.length - 1;
        console.info(`${yellow('➤')} ${gray('clean:')} ${first ? '┌' : last ? '└' : '│'} Cleaned directory: ${blue(`${directory}/${dir}`)}`);
        i++;
    }
}

execSync(`rm -rf node_modules`);
for (const dir of ['apps', 'api', 'packages', 'website']) cleanPackages(dir);

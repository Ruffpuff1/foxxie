import { execSync } from 'node:child_process';

const arg = process.argv[2];
if (!arg) throw new Error('Argument must be provided');

const [, packageName] = arg.split('=');
if (!packageName) throw new Error('Couldnt read packageName');

execSync(`cd packages/${packageName} && git checkout -b "chore/release-${packageName}-$(jq --raw-output '.version' package.json)"`);
execSync(`git add --all .`)
execSync(`cd packages/${packageName} && git commit -m "chore(release): ${packageName} $(jq --raw-output '.version' package.json) 🎉" -m "Build ran for ${process.env.GITHUB_SHA}"`)
execSync(`cd packages/${packageName} && git push -u -f origin "chore/release-${packageName}-$(jq --raw-output '.version' package.json)"`);

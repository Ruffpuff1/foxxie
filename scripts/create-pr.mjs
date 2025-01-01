/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions */
import { Octokit } from '@octokit/action';
import { execSync } from 'node:child_process';

const octokit = new Octokit();
const [OWNER, REPOSITORY] = process.env.GITHUB_REPOSITORY.split('/');

const arg = process.argv[2];
if (!arg) throw new Error('Argument must be provided');

const [, packageName] = arg.split('=');
if (!packageName) throw new Error('Couldnt read packageName');

const newVersion = JSON.parse(execSync(`cd packages/${packageName} && npm version --json`, { encoding: 'utf8' }));
const version = newVersion[`@foxxie/${packageName}`];

const pullRequestBody = [
    `This pull request bumps ${packageName} to **${version}**.`,
    '',
    '⚠️ **Do not change the commit message when merging. It must stay in the format `chore(release): ...`!**',
    '⚠️ Maintainers, make sure everything is alright in this PR before merging it. This is still a beta test, so things may break.'
];

console.log(`🎉 Creating pull request for ${packageName} ${version}`);

const pullRequest = await octokit.pulls.create({
    base: 'main',
    // The format must stay in sync with the one in create-pr-for-release-and-publish.yml
    head: `chore/release-${packageName}-${version}`,
    owner: OWNER,
    repo: REPOSITORY,
    maintainer_can_modify: true,
    title: `chore(release): ${packageName} v${version} 🎉`,
    body: pullRequestBody.join('\n')
});

console.log(`✅ Done! Created pull request ${pullRequest.data.html_url}`);

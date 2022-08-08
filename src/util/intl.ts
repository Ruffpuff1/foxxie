export function detectLocale(href: string) {
    const localeRegex = /\/intl\/(?<loc>\w{1,2}_\w{1,2})/gm;
    const result = localeRegex.exec(href);

    const loc = result?.groups?.loc;
    return loc;
}

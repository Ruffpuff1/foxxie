import useSWR from 'swr';

export default function Pronouns() {
    const fetcher = (url: string) => fetch(`https://pronoundb.org/api/v1${url}`).then(res => res.json());
    const { data } = useSWR('/lookup?id=486396074282450946&platform=discord', fetcher);

    return <span>{data?.pronouns ? parsePronounKey(data.pronouns) : 'unknown'}</span>;
}

function parsePronounKey(key: string) {
    switch (key) {
        case 'ht':
            return 'he/they';
        case 'th':
            return 'they/he';
        case 'hh':
            return 'he/him';
        case 'tt':
            return 'they/them';
    }
}

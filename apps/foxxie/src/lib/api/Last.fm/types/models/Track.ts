export interface TrackSearchResponseLfm {
	results: TrackSearchResult;
}

interface Query {
	'#text': string;
	role: string;
	startPage: `${number}`;
}

interface TrackMatch {
	artist: string;
	listeners: `${number}`;
	mbid: string;
	name: string;
	url: string;
}

interface TrackSearchResult {
	'opensearch:itemsPerPage': `${number}`;
	'opensearch:Query': Query;
	'opensearch:startIndex': `${number}`;
	'opensearch:totalResults': `${number}`;
	trackmatches: {
		track: TrackMatch[];
	};
}

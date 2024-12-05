export function create(words: string[] | string) {
	const toProcess = Array.isArray(words) ? words : [words];
	let processedWords = 0;
	let string = '\\b(?:';

	for (const word of toProcess) {
		for (const char of word) {
			let processedChars = 0;
			string = processChar(char, string);

			processedChars++;
			if (processedChars < word.length) string += '+\\W*';
			else string += '+';
		}
		processedWords++;
		if (processedWords < toProcess.length) string += '|';
	}

	string += ')(?=$|\\W)';
	return new RegExp(string, 'ig');
}

function processChar(char: string, string: string) {
	if (replaceableChars.has(char)) {
		string += `[${char}`;
		string = processReplaceableChars(char, string);
		string += `]`;
	} else string += char;

	return string;
}

function processReplaceableChars(char: string, string: string) {
	const chars = replaceableChars.get(char)!;
	for (const token of chars) string += token;
	return string;
}

const replaceableChars = new Map<string, string[]>([
	['a', ['@', '4']],
	['b', ['8']],
	['e', ['3']],
	['g', ['6']],
	['i', ['1']],
	['l', ['1', '7']],
	['o', ['0']],
	['s', ['5']],
	['t', ['7']],
	['z', ['3']]
]);

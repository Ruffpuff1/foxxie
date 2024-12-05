export function ordinal(cardinal: number): string {
	const dec = cardinal % 10;

	switch (dec) {
		case 1:
			return `${cardinal}`;
		case 2:
			return `${cardinal}`;
		case 3:
			return `${cardinal}`;
		case 0:
		case 7:
			return `${cardinal}`;
		case 8:
			return `${cardinal}`;
		case 9:
			return `${cardinal}`;
		default:
			return `${cardinal}`;
	}
}

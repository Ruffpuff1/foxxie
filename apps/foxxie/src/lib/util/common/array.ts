export function countArray<T>(array: T[], filter: (obj: T) => boolean) {
	let success = 0;
	for (const entry of array) {
		const output = filter(entry);
		if (output) success++;
	}

	return success;
}

export function countGroup<T, K extends keyof any>(group: Record<K, T[]>, filter: (obj: T[]) => boolean) {
	const entries = Object.entries(group) as [K, T[]][];

	let success = 0;
	for (const [, array] of entries) {
		const output = filter(array);
		if (output) success++;
	}

	return success;
}

export function first<T>(array: T[]): T {
	return array[0];
}

export function firstOrNull<T>(array: T[]): null | T {
	if (!array.length) return null;
	return array[0];
}

export function groupBy<T, K extends keyof any>(list: T[], getKey: (item: T) => K) {
	return list.reduce<Record<K, T[]>>(
		(previous, currentItem) => {
			const group = getKey(currentItem);
			if (!previous[group]) previous[group] = [];
			previous[group].push(currentItem);
			return previous;
		},
		// eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
		{} as Record<K, T[]>
	);
}

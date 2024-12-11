import _, { Dictionary, ValueIteratee } from 'lodash';

export type ArrayCallback<T, R> = (member: T) => R;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ArrayExtensions {
	public static Extend<T>(array: T[]) {
		return new List<T>(array);
	}

	public static First<T>(array: T[]): T {
		return array[0] as T;
	}

	public static groupBy<T, K extends keyof any>(list: T[], getKey: (item: T) => K) {
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

	public static Last<T>(array: T[]): T {
		return array[array.length - 1] as T;
	}

	public static maxBy<T, K extends number>(arr: T[], fn: (item: T) => K) {
		return Math.max(...arr.map((v) => (typeof fn === 'function' ? fn(v) : v[fn])));
	}

	public static PropertyOfFirst<T, R>(array: T[], cb: ArrayCallback<T, R>): R;
	public static PropertyOfFirst<T, K extends keyof T>(array: T[], property: K): T[K];

	public static PropertyOfFirst<T, K extends keyof T, R>(array: T[], property: ArrayCallback<T, R> | K): R | T[K] {
		const first = ArrayExtensions.First(array);
		return typeof property === 'function' ? property(first) : first[property];
	}

	public static PropertyOfLast<T, R>(array: T[], cb: ArrayCallback<T, R>): R;

	public static PropertyOfLast<T, K extends keyof T>(array: T[], property: K): T[K];

	public static PropertyOfLast<T, K extends keyof T, R>(array: T[], property: ArrayCallback<T, R> | K): R | T[K] {
		const first = ArrayExtensions.Last(array);
		return typeof property === 'function' ? property(first) : first[property];
	}

	public static Stringify<T>(array: T[], joiner = '\n') {
		return array.join(joiner);
	}
}

export class List<T> {
	private array: T[];

	public constructor(array?: T[]) {
		this.array = array || [];
	}

	public addRange(items: List<T> | T[]) {
		if (items instanceof List) {
			this.push(...items.toArray());
			return this;
		}

		this.push(...items);
		return this;
	}

	public all(predicate?: _.ListIterateeCustom<T, boolean> | undefined) {
		return _.every(this.array, predicate);
	}

	public average(predicate: (value: T) => number) {
		const total = this.array.reduce((acc, rd) => (acc += predicate(rd)), 0);
		return total / this.array.length;
	}

	public count(predicate?: _.ListIterateeCustom<T, boolean> | undefined) {
		if (predicate) {
			const filteredResult = this.filter(predicate);
			return filteredResult.length;
		}

		return this.array.length;
	}

	public distinct() {
		const set = new Set([...this.array]);
		return new List([...set]);
	}

	public filter(predicate?: _.ListIterateeCustom<T, boolean> | undefined): List<T> {
		const filtered = _.filter(this.array, predicate);
		return new List(filtered);
	}

	public find(predicate?: _.ListIterateeCustom<T, boolean> | undefined, fromIndex?: number | undefined) {
		const found = _.find(this.array, predicate, fromIndex);
		return found;
	}

	public first() {
		return this.array[0];
	}

	public groupBy(iteratee?: ValueIteratee<T>): List<T[]>;

	public groupBy<A extends true>(iteratee: ValueIteratee<T>, returnRawGroups: A): Dictionary<T[]>;

	public groupBy<A extends true>(iteratee?: ValueIteratee<T>, returnRawGroups?: A) {
		return returnRawGroups ? _.groupBy(this.array, iteratee) : new List(_.toArray(_.groupBy(this.array, iteratee)));
	}

	public map<R>(callbackfn: (value: T, index: number, array: T[]) => R, thisArg?: any) {
		const mapped = this.array.map(callbackfn, thisArg);
		return new List(mapped);
	}

	public maxBy(iteratee?: undefined | ValueIteratee<T>) {
		const result = _.maxBy(this.array, iteratee);

		return result;
	}

	public member(index: number) {
		return this.array[index];
	}

	public minBy(iteratee?: undefined | ValueIteratee<T>) {
		const result = _.minBy(this.array, iteratee);

		return result;
	}

	public ofFirst<R>(cb: ArrayCallback<T, R>): R;

	public ofFirst<K extends keyof T>(property: K): T[K];

	public ofFirst<K extends keyof T, R>(property: ArrayCallback<T, R> | K): R | T[K] {
		const first = this.first();
		return typeof property === 'function' ? property(first) : first[property];
	}

	public orderBy(iteratees?: _.Many<_.ListIterator<T, unknown>> | undefined, orders?: _.Many<'asc' | 'desc' | boolean> | undefined) {
		const result = _.orderBy(this.array, iteratees, orders);
		return new List(result);
	}

	public orderByAscending(iteratees?: _.Many<_.ListIterator<T, unknown>> | undefined) {
		return this.orderBy(iteratees, 'asc');
	}

	public orderByDescending(iteratees?: _.Many<_.ListIterator<T, unknown>> | undefined) {
		return this.orderBy(iteratees, 'desc');
	}

	public push(...items: T[]): number {
		return this.array.push(...items);
	}

	public slice(start?: number | undefined, end?: number | undefined) {
		return new List(this.array.slice(start, end));
	}

	public sort(compareFn?: ((a: T, b: T) => number) | undefined) {
		const sorted = this.array.sort(compareFn);
		return new List(sorted);
	}

	public stringify(joiner = '\n') {
		return this.array.join(joiner);
	}

	public sumBy(iteratee?: ((value: T) => number) | string | undefined) {
		return _.sumBy(this.array, iteratee);
	}

	public take(amount?: number) {
		return this.slice(0, amount);
	}

	public toArray() {
		return this.array;
	}

	public get length(): number {
		return this.array.length;
	}
}

export class ArrayService {
	public static FirstOrNull<T>(array: T[]): null | T {
		if (!array.length) return null;
		return array[0];
	}
}

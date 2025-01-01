export interface AccurateTimeout<T extends readonly any[] = readonly any[]> {
	cb(...args: T): void;
	fn(...args: T): void;
	stop(): void;
	timeout: NodeJS.Timeout;
}

export function clearAccurateTimeout<T extends readonly any[]>(context: AccurateTimeout<T>) {
	clearTimeout(context.timeout);
}

export function setAccurateTimeout<T extends readonly any[]>(fn: (...args: T) => void, delay: number, ...args: T) {
	const end = Date.now() + delay;
	const context: AccurateTimeout<T> = {
		cb(...args: T) {
			const remaining = end - Date.now();
			if (remaining < 1) {
				fn(...args);
			} else {
				// eslint-disable-next-line @typescript-eslint/unbound-method
				context.timeout = setTimeout(context.cb, delay, ...args).unref();
			}
		},
		fn,
		stop() {
			clearAccurateTimeout(context);
		},
		timeout: null!
	};

	// eslint-disable-next-line @typescript-eslint/unbound-method
	context.timeout = setTimeout(context.cb, delay, ...args).unref();
	return context;
}

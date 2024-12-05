import { createReferPromise, ReferredPromise } from '#utils/common';

export class WorkerResponse {
	private id = -1;

	private handler: ReferredPromise<unknown> | null = null;

	private timer: NodeJS.Timeout | null = null;

	public define(id: number) {
		this.id = id;
		this.handler = createReferPromise();

		return this.handler.promise;
	}

	public timeout(delay: number | null) {
		if (delay === null) {
			return this.clearTimeout();
		}

		const { id } = this;
		if (id === -1) {
			return false;
		}

		this.clearTimeout();
		this.timer = setTimeout(() => {
			this.reject(id, new Error());
		}, delay).unref();
		return true;
	}

	public resolve(id: number, data: unknown) {
		if (this.id === id) {
			this.id = -1;
			this.clearTimeout();
			this.handler!.resolve(data);
			this.handler = null;
		}
	}

	public reject(id: number, error: Error) {
		if (this.id === id) {
			this.id = -1;
			this.clearTimeout();
			this.handler!.reject(error);
			this.handler = null;
		}
	}

	private clearTimeout() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;

			return true;
		}

		return false;
	}
}

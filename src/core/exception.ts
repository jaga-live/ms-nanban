/// ///HTTP Exception
export class HttpException extends Error {
	constructor(
        public readonly message: string,
        public readonly statusCode: number,
	) {
		super(message);
	}
}

/// ///TypeORM Exception
export class SQLException extends Error {
	constructor(
        public readonly message: string,
        public readonly error: number,
	) {
		super(message);
	}
}

/// ///Validation Exception
export class ValidationException extends Error {
	constructor(
        public readonly details?: [any],
	) {
		super();
	}
}

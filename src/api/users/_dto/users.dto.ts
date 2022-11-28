import Joi from 'joi';
import { HttpException, ValidationException } from '../../../core/exception';

/// ////User DTO
export class UserDto {
	constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly userName: string,
        public readonly email: string,
	) { }

	static create(body: UserDto) {
		return new UserDto(
			body._id,
			body.name,
			body.userName,
			body.email,
		);
	}
}

export class CreateUserDto {
	constructor(
        public name: string,
        public email: string,
        public role: string,
	) { }

	public static async validate(dto: CreateUserDto) {
		const schema = Joi.object({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			role: Joi.string().required(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});
		return validate;
	}
}

export class UpdateUserDto {
	constructor(
        public id?: number,
        public name?: string,
        public donor_registered?: boolean,
	) { }

	public static async validate(dto: UpdateUserDto): Promise<UpdateUserDto> {
		if (!dto) throw new ValidationException();

		const schema = Joi.object({
			id: Joi.number(),
			name: Joi.string(),
			donor_registered: Joi.boolean(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});
		return validate;
	}
}

import { injectable } from 'inversify';
import Joi from 'joi';
import { ValidationException } from '../../../core/exception';

@injectable()
export class CreateBloodCampDto {
	constructor(
        public camp_name: string,
        public event_address: string,
        public mobile_number: number,
	) { }

	public static async validate(dto: CreateBloodCampDto) {
		if (!dto) throw new ValidationException();

		const schema = Joi.object({
			camp_name: Joi.string().required(),
			event_address: Joi.string().required(),
			mobile_number: Joi.number().required(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});
		return validate;
	}
}

/// Edit DTO
export class EditBloodCampDto {
	constructor(
        public camp_name?: string,
        public event_address?: string,
        public mobile_number?: number,
	) { }

	public static async validate(dto: EditBloodCampDto) {
		if (!dto) throw new ValidationException();

		const schema = Joi.object({
			camp_name: Joi.string(),
			event_address: Joi.string(),
			mobile_number: Joi.number(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});
		return validate;
	}
}

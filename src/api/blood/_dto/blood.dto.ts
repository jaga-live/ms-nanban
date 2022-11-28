import Joi from 'joi';
import { ValidationException } from '../../../core/exception';

export class BloodDto {
	constructor(
        public blood_group : string,
        public matching_blood_group : string[],
	) {}

	public static async validation(dto : BloodDto[]) {
		if (!dto) throw new ValidationException();
		const schema = Joi.object({
			blood_mapping: Joi.object().required(),
		});

		const validate = schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});
		return validate;
	}
}

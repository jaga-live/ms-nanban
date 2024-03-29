import Joi from 'joi';
import { ValidationException } from '../../../core/exception';

export class DonorStatusDto {
	constructor(
        public id : number,
        public donor_id : number,
        public status: boolean,
        public blood_request_id: number,
        public created_at: string,
	) {}

	public static async validate(dto : DonorStatusDto) {
		if (!dto) throw new ValidationException();
		delete dto.id;

		const schema = Joi.object({
			id: Joi.number().required(),
			donor_id: Joi.number().required(),
			status: Joi.boolean().required(),
			blood_request_id: Joi.number().required(),
			created_at: Joi.string().required(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});

		return validate;
	}
}

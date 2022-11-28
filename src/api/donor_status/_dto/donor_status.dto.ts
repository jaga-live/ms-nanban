import Joi from 'joi';
import { ValidationException } from '../../../core/exception';

export class DonorStatusDto {
	constructor(
        public id : number,
        public donor_id : number,
        public is_Accepted: boolean,
        public blood_request_id: number,
        public created_At: string,
	) {}

	public static async validate(dto : DonorStatusDto) {
		if (!dto) throw new ValidationException();
		delete dto.id;

		const schema = Joi.object({
			id: Joi.number().required(),
			donor_id: Joi.number().required(),
			is_Accepted: Joi.boolean().required(),
			blood_request_id: Joi.number().required(),
			created_At: Joi.string().required(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});

		return validate;
	}
}

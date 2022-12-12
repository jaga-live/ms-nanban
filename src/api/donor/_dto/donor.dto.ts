import Joi from 'joi';
import { ValidationException } from '../../../core/exception';

export class CreateDonorDto {
	constructor(
        public id: number,
        public userId: number,
        public full_name: string,
        public gender: string,
        public date_of_birth: string,
        public blood_group : string,
        public address_line_1: string,
        public address_line_2: string,
        public pin: number,
        public mobile_number: number,
        public email: string,
        public last_date_of_donation: string,
        public preferred_frequency: string,
	) {}

	public static async validate(dto : CreateDonorDto) {
		const schema = Joi.object({
			full_name: Joi.string().required(),
			gender: Joi.string().required(),
			date_of_birth: Joi.string().required(),
			blood_group: Joi.string().required(),
			address_line_1: Joi.string().required(),
			address_line_2: Joi.string().required(),
			city: Joi.string().required(),
			pin: Joi.number().required(),
			mobile_number: Joi.number().required(),
			email: Joi.string().required().email(),
			last_date_of_donation: Joi.string().required(),
			preferred_frequency: Joi.string().required(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});

		return validate;
	}
}

// update status
export class UpdateStatusDTO {
	constructor(
        public blood_req_id: number,
        public status: boolean,
	) {}

	public static async validate(dto : UpdateStatusDTO) {
		const schema = Joi.object({
			blood_req_id: Joi.number().required(),
			status: Joi.boolean().required(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});

		return validate;
	}
}

// confirm otp dto
export class ConfirmOTPDTO {
	constructor(
        public blood_req_id: number,
        public otp: string,
	) {}

	public static async validate(dto : UpdateStatusDTO) {
		const schema = Joi.object({
			blood_req_id: Joi.number().required(),
			otp: Joi.string().required(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});

		return validate;
	}
}

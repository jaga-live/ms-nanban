import { injectable } from 'inversify';
import Joi from 'joi';
import { ValidationException } from '../../../core/exception';

@injectable()
export class CreateBloodBankDto {
	constructor(
        public name: string,
        public address: string,
        public pin: string,
		public state: string,
		public approvalStatus: string,
	) { }

	public static async validate(dto: CreateBloodBankDto) {
		if (!dto) throw new ValidationException();

		const schema = Joi.object({
			blood_bank_name: Joi.string().required(),
			address_line_1: Joi.string().required(),
			address_line_2: Joi.string().required(),
			pin: Joi.number().required(),
			state: Joi.string().required(),
			city: Joi.string().required(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});
		return validate;
	}
}

/// Edit DTO
export class EditBloodBankDto {
	constructor(
        public hospital_name?: string,
        public address?: string,
        public pin?: string,
        public state?: string,
        public qrId?: string,
        public id?: string,
	) { }

	public static async validate(dto: EditBloodBankDto) {
		if (!dto) throw new ValidationException();
		delete dto.qrId;
		delete dto.id;

		const schema = Joi.object({
			hospital_name: Joi.string(),
			address_line_1: Joi.string(),
			address_line_2: Joi.string(),
			pin: Joi.number(),
			state: Joi.string(),
			city: Joi.string(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});
		return validate;
	}
}

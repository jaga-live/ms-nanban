import Joi from 'joi';
import { ValidationException } from '../../../core/exception';

export class BloodRequestDto {
	constructor(
      public id : number,
      public blood_group: string,
      public required_units: number,
      public requester_name: string,
      public mobile_number: string,
      public hospital_name: string,
      public place: string,
      public address_line1: string,
      public address_line2: string,
      public pin_code: number,
	) {}

	public static async validate(dto: BloodRequestDto) {
		if (!dto) throw new ValidationException();
		delete dto.id;

		const schema = Joi.object({
			blood_group: Joi.string().required(),
			required_units: Joi.number().min(1).max(200).required(),
			requester_name: Joi.string().required(),
			gender: Joi.string().required(),
			mobile_number: Joi.number().integer().required(),
			hospital_name: Joi.string().min(2).required(),
			place: Joi.string().required(),
			address_line_1: Joi.string().required(),
			address_line_2: Joi.string().required(),
			state: Joi.string().required(),
			city: Joi.string().required(),
			pin: Joi.number().required(),
			type_of_request: Joi.string().required(),
		});

		const validate = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});

		return validate;
	}
}

/**
 * Interface for filtering response
 */
export interface BloodRequestFilterResponse {
    id: number;
    pin: number;
    mobile_number: number;
    email: string;
    last_date_of_donation: Date;
    full_name: string;
    blood_group: string;
    donor_id: number;
    is_accepted: string;
    blood_request_id: number;
    created_at: Date;
}

/**
 * New Donor Status
 */
export interface NewDonorStatus {
    donor_id: number;
    is_accepted: string;
    blood_request_id: number;
    created_at: Date;
}

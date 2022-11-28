import Joi from 'joi';
import { ValidationException } from '../../../core/exception';

export enum SocialAuthTypes{
    GOOGLE = 'google',
    MICROSOFT = 'microsoft'
}

export class SocialAuthDto {
	constructor(
        public token: string,
        public provider: string,
        public expo_push_token?: string,
	) { }

	public static async validate(dto: SocialAuthDto) {
		if (!dto) throw new ValidationException();

		const schema = Joi.object({
			token: Joi.string().required(),
			provider: Joi.string().valid(
				SocialAuthTypes.GOOGLE,
				SocialAuthTypes.MICROSOFT,
			).required(),
			expo_push_token: Joi.string(),
		});

		const validateSchema = await schema.validateAsync(dto).catch((err) => {
			throw new ValidationException(err.details);
		});

		return validateSchema;
	}
}

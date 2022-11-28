import { inject } from 'inversify';
import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { TYPES } from '../../core/inversify/types';
import { IMailService } from '../../shared/mail/mail.service';

@controller('')
export class CommonController {
	constructor(
        @inject(TYPES.MailService) private readonly mailService: IMailService,
	) {}

    @httpPost('/contact-us')
	async contactUs(
        @requestBody() req: any,
	) {
		const { name, email, message } = req;

		await this.mailService.sendMail({
			type: 'contact_us',
			context: {
				name,
				email,
				message,
			},
		});

		return {
			message: 'Ok',
		};
	}
}

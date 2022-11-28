import { injectable } from 'inversify';
import { SmsFactory } from './factory/sms.factory';
import { SmsDto } from './_dto/sms.dto';

@injectable()
export class SmsService {
	constructor() { }

	async send(payload: SmsDto) {
		const getConfig = new SmsFactory().getConfig(payload);

		const smsConfig = {
			otp: payload.otp,
			phone: payload.phone,
		};

		console.log(smsConfig);
	}
}

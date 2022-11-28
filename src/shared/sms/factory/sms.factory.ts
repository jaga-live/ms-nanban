import { SmsDto } from '../_dto/sms.dto';

export enum SmsTypes{
    requesterOtp= 'requesterOtp'
}

export class SmsFactory {
	constructor() { }

	async getConfig(payload: SmsDto) {
		const { type } = payload;

		switch (type) {
		case SmsTypes.requesterOtp:
			return this.requesterOtp(payload);

		default:
			break;
		}
	}

	private async requesterOtp(payload: SmsDto) {

	}
}

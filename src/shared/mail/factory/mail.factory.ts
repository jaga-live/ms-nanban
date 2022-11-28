import { Attachments } from '../../../api/donor_status/service/donor_status.service';

/// Nanban Email
const CONTACT_EMAIL = 'contactnanban@mailinator.com';

/// ///Shared mail Info
const _defaultMailContext = {
};

enum MailTypes {
    welcomeMail = 'welcomeMail',
    send_otp = 'send_otp',
    send_certificate = 'send_certificate',
    contact_us = 'contact_us'
}

export class MailFactory {
	constructor(
        private readonly type: string,
        private readonly to: string,
        private readonly subject: string,
        private readonly html: string,
        private readonly context: any,
        public readonly attachments?: Attachments[],
	) { }

	public static getConfig(config: MailFactory) {
		switch (config.type) {
		case MailTypes.welcomeMail: return this.welcomeMail(config);
		case MailTypes.send_otp: return this.sendOtp(config);
		case MailTypes.send_certificate: return this.sendCertificate(config);
		case MailTypes.contact_us: return this.contactUs(config);
		default:
			throw new Error('Invalid Mail type');
		}
	}

	/// ////Welcome Mail
	public static welcomeMail(config: MailFactory) {
		const { receiverName } = config.context;

		const subject = 'Ping - Account Creation';
		const data = {
			to: config.to,
			subject,
			template: 'signup',
			context: {
				..._defaultMailContext,
				receiverName,
				to: config.to,
			},
		};

		return data;
	}

	/// ////Welcome Mail
	public static sendOtp(config: MailFactory) {
		const { otp } = config.context;

		const subject = 'One Time Password - PING';
		const data = {
			to: config.to,
			subject,
			template: 'send_otp',
			context: {
				..._defaultMailContext,
				to: config.to,
				otp,
			},
		};

		return data;
	}

	// certificate for blood donation
	public static sendCertificate(config: MailFactory) {
		const subject = 'CERTIFICATE OF APPRECIATION FOR DONATION';
		const data = {
			to: config.to,
			subject,
			template: 'send_certificate',
			attachments: config?.attachments,
		};

		return data;
	}

	// certificate for blood donation
	public static contactUs(config: MailFactory) {
		const { name, message, email } = config.context;
		const subject = `Message from ${name}`;
		const data = {
			to: CONTACT_EMAIL,
			subject,
			template: 'contact-us',
			context: {
				..._defaultMailContext,
				email,
				name,
				message,
			},
		};

		return data;
	}
}

import { Attachment } from 'nodemailer/lib/mailer';

export class MailDto {
	constructor(
        public readonly to: string,
        public readonly subject: string,
        public readonly template: string,
        public readonly context?: Object,
        public readonly attachments?: Attachment[],
	) {}
}

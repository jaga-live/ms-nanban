import fs from 'fs';
import pdfCreator from 'pdf-creator-node';
import { AVEON_LOGO_PATH, CERTIFICATE_PATH, NANBAN_LOGO_PATH } from './types';

const htmlTemplate = fs.readFileSync(CERTIFICATE_PATH, 'utf-8');

const options = {
	format: 'A4',
	orientation: 'landscape',
};

export const generateCertificate = async (data): Promise<string> => {
	try {
		const AVEON_LOGO = AVEON_LOGO_PATH.toString('base64');
		const NANBAN_LOGO = NANBAN_LOGO_PATH.toString('base64');

		data.aveon_logo = AVEON_LOGO;
		data.nanban_logo = NANBAN_LOGO;

		const document = {
			html: htmlTemplate,
			data,
			type: 'buffer',
		};

		return new Promise((resolve, reject) => {
			pdfCreator.create(document, options)
				.then((res) => {
					const base64Data = Buffer.from(res).toString('base64');
					resolve(base64Data);
				})
				.catch((err) => console.log(err));
		});
	} catch (error) {
		console.log(error);
	}
};

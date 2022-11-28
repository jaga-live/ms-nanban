import fs from 'fs';
import path from 'path';

export const CERTIFICATE_PATH = path.join(__dirname, '../../shared/mail/templates/certificate.html');
export const AVEON_LOGO_PATH = fs.readFileSync(path.join(`${__dirname}../../../shared/mail/templates/assets/aveon-logo.png`));
export const NANBAN_LOGO_PATH = fs.readFileSync(path.join(`${__dirname}../../../shared/mail/templates/assets/nanban-logo.png`));

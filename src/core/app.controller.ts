import { controller, httpGet } from 'inversify-express-utils';
import { container } from './inversify/inversify.config';
import { TYPES } from './inversify/types';

@controller('')
export class Ping {
	constructor() { }

    @httpGet('', TYPES.AuthGuard)
	async ping() {
		return {
			app: 'Nanban',
			server: 'Express JS/ Inversify JS',
			language: 'TypeScript',
		};
	}
}

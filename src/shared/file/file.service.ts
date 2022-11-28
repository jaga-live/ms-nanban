import { injectable } from 'inversify';

@injectable()
export class FileService {
	async readFile(file: string): Promise<any> {
		console.log('Hello');
	}
}

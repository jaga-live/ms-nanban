import { NextFunction, Request, Response } from 'express';
import { Logger } from '../shared/logger/logger';
import { HttpException, SQLException, ValidationException } from './exception';

/// /Error Config
export const GlobalErrorConfig = (server: any) => {
	server.setErrorConfig((app) => {
		app.use((err: any, req: Request, res: Response, next: NextFunction) => {
			switch (true) {
			case err instanceof HttpException:
				Logger.error(`HttpException: ${err.message}`);
				return res.status(err.statusCode).json({ error: err.message });

			case err instanceof SQLException:
				Logger.error(`SQLException: ${err.message}`);
				return res.status(400).json({ error: 'SQL Exception' });

			case err instanceof ValidationException:
				Logger.error(`ValidationException: ${JSON.stringify(err.details)}`);
				return res.status(400).json({
					error: 'validation Exception',
					trace: err.details,
				});

			default:
				console.log(err);
				res.status(500).json({ error: 'Internal Server Exception' });
			}
		});
	});
	return server;
};

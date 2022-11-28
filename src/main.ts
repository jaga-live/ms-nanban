import 'reflect-metadata';
import cors from 'cors';
import express, { NextFunction, Response, Request } from 'express';
import helmet from 'helmet';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './core/inversify/inversify.config';
import { Sql } from './database/sql';
import { GlobalErrorConfig } from './core/server';

export const bootstrap = () => new Promise((resolve) => {
	/// /Connect to SQL Server
	new Sql().connect();

	/// Start Server
	const server = new InversifyExpressServer(container);
	server.setConfig((app) => {
		app.use(express.json());
		app.use(cors());
		app.use(helmet());
	});

	/// Global Error Config
	GlobalErrorConfig(server);

	/// Build Server
	const app = server.build();
	app.listen(process.env.PORT || 5000, () => {
		console.log(
			`Server is running on http://localhost:${process.env.PORT || 5000}`,
		);
		resolve(app);
	});
});

bootstrap();

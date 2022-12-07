import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { verify } from 'jsonwebtoken';
import { HttpException } from '../../../core/exception';
import { UserRepository } from '../../users/repository/users.repository';
import { AuthRepository } from '../repository/auth.repository';
import 'dotenv/config';

export class AuthGuard extends BaseMiddleware {
	private readonly JWT_SECRET: string = process.env.JWT_SECRET;

	constructor(
        @inject(UserRepository) private readonly userRepo: UserRepository,
        @inject(AuthRepository) private readonly authRepo: AuthRepository,
	) { super(); }

	public async handler(req: any, res: Response, next: NextFunction): Promise<any> {
		try {
			const auth = req.headers.authorization;
			if (!auth) throw new HttpException('Bearer Token missing in request headers', 401);

			const jwt = auth.split(' ')[1];
			const decoded: any = verify(jwt, this.JWT_SECRET);
			
			/// //Fetch User data
			const user = await this.userRepo.find_by_id(decoded.id);
			if (!user) throw new HttpException('Unauthorized Exception', 401);
			
			/// //validate User session form DB
			const authSession = await this.authRepo.get_auth_session_with_id(decoded.userId, decoded.sessionId);
			if (!authSession) throw new HttpException('Unauthorized Exception', 401);

			req.userData = { ...decoded };
			req.authToken = jwt;
			next();
		} catch (error) {
			// console.log(error);
			return res.status(401).json({
				error: 'Unauthorized Exception',
			});
		}
	}
}

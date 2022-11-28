import {
	Request, Response, NextFunction, json,
} from 'express';
import { HttpException } from '../../../core/exception';

export const RolesGuard = (role: string[]) => async (req: any, res: Response, next: NextFunction) => {
	try {
		const currentRole = req.userData.role;
		if (!role.includes(currentRole)) throw new HttpException('Forbidden Route', 403);

		next();
	} catch (error) {
		return res.status(403).json({
			error: 'Forbidden Route',
		});
	}
};

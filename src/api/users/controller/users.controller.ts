import { Request } from 'express';
import { inject } from 'inversify';
import {
	controller, httpDelete, httpGet, httpPatch, httpPost,
} from 'inversify-express-utils';
import { Req } from '../../../core/custom.types';
import { TYPES } from '../../../core/inversify/types';
import { IMailService } from '../../../shared/mail/mail.service';
import { RolesGuard } from '../../auth/middleware/roles.middleware';
import { ROLES } from '../enum/roles.user';
import { IUserService } from '../service/users.service';
import { CreateUserDto, UpdateUserDto } from '../_dto/users.dto';

@controller('/user')
export class UserController {
	constructor(
        @inject(TYPES.UserService) private readonly userService: IUserService,
        @inject(TYPES.MailService) private readonly mailService: IMailService,
	) { }

    /// ///CREATE
    /// /Signup User
    @httpPost('/signup')
	async signup(req: Request) {
		/// Save User
		const payload = await CreateUserDto.validate(req.body);
		const userData = await this.userService.signupUser(payload);

		return userData;
	}

    /// //VIEW
    /// //View all Users
    @httpGet('')
    async view_users() {
    	return this.userService.viewUsers();
    }

    /// ///PATCH
    /// //Edit a user
    @httpPatch('')
    async update_user(req: Request) {
    	const payload = req.body;

    	const validatePayload = await UpdateUserDto.validate(payload);
    	await this.userService.editUser(validatePayload.id, validatePayload);

    	return payload;
    }

    /// /DELETE
    /// //Delete User
    @httpDelete('')
    async delete_user(req: Request) {
    	await this.userService.deleteUser(req.body.id);
    	return { message: 'User deleted' };
    }

    /// //
    /// /User profile
    @httpGet(
    	'/profile',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.DONOR, ROLES.ADMIN]),
    )
    async user_profile(req: Req) {
    	const { userId } = req.userData;
    	const user = await this.userService.viewUser(userId);
    	return user;
    }
}

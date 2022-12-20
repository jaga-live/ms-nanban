import { inject, injectable } from 'inversify';
import { UserRepository } from '../repository/users.repository';
import { HttpException } from '../../../core/exception';
import { AuthRepository } from '../../auth/repository/auth.repository';
import { IUser, User } from '../model/users.model';
import { UpdateUserDto } from '../_dto/users.dto';
import { TYPES } from '../../../core/inversify/types';
import { MailService } from '../../../shared/mail/mail.service';

export interface IUserService{
    signupUser(payload: any): Promise<IUser>
    viewUsers(): Promise<IUser[]>
    viewUser(id: number): Promise<any>
    viewUserByEmail(email: string): Promise<any>
    editUser(id: number, payload: UpdateUserDto): Promise<any>
    deleteUser(id: number): Promise<any>
}
@injectable()
export class UserService implements IUserService {
	constructor(
        @inject(UserRepository) private readonly User: UserRepository,
        @inject(AuthRepository) private readonly Auth: AuthRepository,
        @inject(TYPES.MailService) private readonly MailService: MailService,
	) { }

	/// /Create
	/// //Signup User
	async signupUser(payload: any): Promise<IUser> {
		const { email } = payload;

		/// //Validate Email
		const validateEmail = await this.User.find_by_email(email);
		if (validateEmail) throw new HttpException('Email already exists', 409);

		/// Persist user data
		const userData: User = await this.User.create_user(payload);

		/// Create Auth table for this user
		await this.Auth.create_auth(userData);

		/// Mail info for creating passwords
		await this.MailService.sendMail(
			{
				to: email,
				type: 'welcomeMail',
				context: {
					receiverName: payload.name,
				},
			},
		);

		return userData;
	}

	/// //View
	/// //View all Users
	async viewUsers(): Promise<IUser[]> {
		const users = await this.User.find_all_users();
		return users;
	}

	/// /View user by ID
	async viewUser(id: number): Promise<IUser> {
		const user = await this.User.find_by_id(id);
		return user;
	}

	/// /View user by Email
	async viewUserByEmail(email: string) {
		const user = await this.User.find_by_email(email);
		return user;
	}

	/// //PATCH
	/// /Edit User
	async editUser(id: number, payload: UpdateUserDto): Promise<any> {
		await this.User.update_by_id(id, payload);
	}

	/// //Delete
	/// Delete user with id
	async deleteUser(id: number) {
		const user_to_delete = await this.User.find_by_id(id);
		if (!user_to_delete) throw new HttpException('User not found', 400);

		/// Delete Auth
		await this.Auth.delete_auth(user_to_delete.id);

		await this.User.delete_by_id(id);
	}
}

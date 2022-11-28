import { inject, injectable } from 'inversify';
import { x } from 'joi';
import { HttpException } from '../../../core/exception';
import { TYPES } from '../../../core/inversify/types';
import { Repository } from '../../../database/sql';
import { IUser, User } from '../model/users.model';
import { UpdateUserDto } from '../_dto/users.dto';

@injectable()
export class UserRepository {
	constructor(
        @inject(TYPES.RepoService) private readonly rep: Repository,
	) { }

	/// //CREATE
	async create_user(payload: any): Promise<User> {
		/// /User Payload
		let user = new User();
		user = { ...payload };

		await this.rep.user().save(user);
		return user;
	}

	/// //GET
	/// /Find all users
	async find_all_users(): Promise<IUser[]> {
		const users = await this.rep.user().find();
		console.log(users, 'USER');
		return users;
	}

	/// //Find by id
	async find_by_id(id: number) {
		const user = await this.rep.user().findOneBy({ id });
		return user;
	}

	/// /Find User by Email
	async find_by_email(email: string): Promise<IUser> {
		const user = await this.rep.user().findOne({ where: { email } });
		return user;
	}

	async find_by_userName(userName: string) {

	}

	/// //PATCH
	async update_by_id(id: number, payload: UpdateUserDto) {
		const user_to_update = await this.find_by_id(id);
		if (!user_to_update) throw new HttpException('User Not Found', 400);

		delete payload.id;
		await this.rep.user().update({ id }, { ...payload });
	}

	/// /DELETE
	async delete_by_id(id: number) {
		const userToDelete = await this.find_by_id(id);
		if (!userToDelete) throw new HttpException('User Not Found', 400);

		await this.rep.user().remove(userToDelete);
		return userToDelete;
	}

	async custom_delete(query: any) {
		/// /TODO
	}
}

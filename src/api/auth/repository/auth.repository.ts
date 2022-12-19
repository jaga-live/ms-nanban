import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/inversify/types';
import { Repository } from '../../../database/sql';
import { IUser, User } from '../../users/model/users.model';
import { Auth, AuthSession, ExpoPushToken } from '../model/auth.model';

@injectable()
export class AuthRepository {
	constructor(
        @inject(TYPES.RepoService) private readonly repo: Repository,
	) { }

	/// //Create
	/// Create Auth
	async create_auth(user: User) {
		/// //Auth Payload
		const auth = new Auth();
		auth.user = user;
		auth.userId = user.id;

		await this.repo.auth().save(auth);
	}

	/// Create Auth Session
	async create_auth_session(user: IUser, auth: Auth, session: string) {
		/// //Auth Session Payload
		const authSession = new AuthSession();
		authSession.userId = user.id;
		authSession.authId = auth.id;
		authSession.session = session;

		await this.repo.auth_session().save(authSession);
	}

	// Store push token
	async store_expo_push_token(user: IUser, expo_push_token: string) {
		const pushToken = new ExpoPushToken();
		pushToken.userId = user.id;
		pushToken.expo_push_token = expo_push_token;

		await this.repo.expo_expo_push_token().save(pushToken);
	}

	/// /GET
	/// Find Auth for a User
	async get_auth(userId: number) {
		const auth = await this.repo.auth().findOne({ where: { userId } });
		return auth;
	}

	/// Find Auth session for a user
	async get_auth_session(userId: number) {
		const authSession = await this.repo.auth_session().find({ where: { userId } });
		return authSession;
	}

	/// Find single session for a user
	async get_single_auth_session(sessionId: string) {
		const authSession = await this.repo.auth_session().findOne({ where: { session: sessionId } });
		return authSession;
	}

	/// Get Auth Session with userID and session Id
	async get_auth_session_with_id(userId: number, sessionId: string) {
		const authSession = await this.repo.auth_session().findOne({ where: { userId, session: sessionId } });
		return authSession;
	}

	/// /UPDATE
	/// Reset OTP
	async update_auth(userId: number, payload) {
		await this.repo.auth().update({ userId }, { ...payload });
	}

	/// //Delete
	/// Delete single auth session
	async delete_single_session(sessionId: string) {
		const sessionToDelete = await this.get_single_auth_session(sessionId);
		await this.repo.auth_session().delete(sessionToDelete);
	}

	// Delete push tokens for user
	async delete_expo_push_token(userId: number): Promise<any> {
		await this.repo.expo_expo_push_token()
			.createQueryBuilder('expo_push_token')
			.delete()
			.where('userId = :userId', { userId })
			.execute();
	}

	// Delete push tokens for user
	async delete_expo_push_token_by_token(pushToken: string): Promise<any> {
		await this.repo.expo_expo_push_token()
			.createQueryBuilder('expo_push_token')
			.delete()
			.where('expo_push_token = :pushToken', { pushToken })
			.execute();
	}

	/// Delete Auth and auth Session
	async delete_auth(userId: number) {
		const auth_to_delete = await this.get_auth(userId);
		const authSession_to_delete = await this.get_auth_session(userId);

		await this.repo.auth_session().remove(authSession_to_delete);
		await this.repo.auth().remove(auth_to_delete);
	}
}

import 'reflect-metadata';
import { OAuth2Client } from 'google-auth-library';
import { inject, injectable } from 'inversify';
import fetch from 'cross-fetch';
import { HttpException } from '../../core/exception';
import { container } from '../../core/inversify/inversify.config';
import { TYPES } from '../../core/inversify/types';
import { UserService } from '../users/service/users.service';
import { AuthService } from './auth.service';
import { SocialAuthDto } from './_dto/auth.dto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@injectable()
export class SocialAuthService {
	constructor(
        @inject(TYPES.UserService) private readonly userService: UserService,
	) { }

	/// /Google Authentication
	async google_auth(payload: SocialAuthDto) {
		const { token } = payload;
		const authService = container.get<AuthService>(TYPES.AuthService);

		let resPayload: any;
		await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID })
			.then((res) => { resPayload = { ...res }; })
			.catch((err) => {
				console.log(err);
				throw new HttpException('Google Auth Failed', 401);
			});

		const { email_verified, email, name } = resPayload.payload;

		if (email_verified) {
			const user = await this.userService.viewUserByEmail(email);
			/// If user exists -> login
			if (user) return authService.login(email, payload?.expo_push_token ? payload.expo_push_token : '');

			/// else Create user and login
			const createUser = await this.userService.signupUser({
				name,
				email,
				role: 'donor',
				donor_registered: false,
			});
			return authService.login(createUser.email);
		}

		throw new HttpException('Google Auth Failed', 401);
	}

	/**
     * Microsoft Authentication
     */
	async microsoft_auth(payload: SocialAuthDto) {
		const { token } = payload;
		const authService = container.get<AuthService>(TYPES.AuthService);

		const { MICROSOFT_GRAPH_URL } = process.env;

		// verify token against graph api
		const graphResponse = await fetch(MICROSOFT_GRAPH_URL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await graphResponse.json();

		const { mail, givenName } = data;

		const user = await this.userService.viewUserByEmail(mail);
		/// If user exists -> login
		if (user) return authService.login(mail, payload?.expo_push_token ? payload.expo_push_token : '');

		/// else Create user and login
		const createUser = await this.userService.signupUser({
			name: givenName,
			email: mail,
			role: 'donor',
			donor_registered: false,
		});
		return authService.login(createUser.email);
	}
}

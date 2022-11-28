import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { compareSync, hashSync } from 'bcrypt';
import { HttpException } from '../../core/exception';
import { randomSixDigitOtp } from '../../helper/calc';
import { UserRepository } from '../users/repository/users.repository';
import { TYPES } from '../../core/inversify/types';
import { MailService } from '../../shared/mail/mail.service';
import { AuthRepository } from './repository/auth.repository';
import { Repository } from '../../database/sql';
import { UserService } from '../users/service/users.service';
import { SocialAuthDto, SocialAuthTypes } from './_dto/auth.dto';
import { SocialAuthService } from './social_auth.service';

@injectable()
export class AuthService {
	private readonly JWT_SECRET: string = process.env.JWT_SECRET;

	constructor(
        @inject(UserRepository) private readonly UserRepo: UserRepository,
        @inject(AuthRepository) private readonly Authrepo: AuthRepository,
        @inject(TYPES.UserService) private readonly UserService: UserService,
        @inject(TYPES.RepoService) private readonly repo: Repository,
        @inject(TYPES.MailService) private readonly mailService: MailService,
        @inject(TYPES.SocialAuthService) private readonly socialAuthService: SocialAuthService,
	) { }

	/// //Login with Email Pass
	async login(email: string, expoPushToken?: string) {
		/// //Validate User
		const isUserValid = await this.UserRepo.find_by_email(email);
		if (!isUserValid) throw new HttpException('Invalid Email or Password', 400);

		/// /Fetch Auth for user & validate password
		const isAuthvalid = await this.Authrepo.get_auth(isUserValid.id);
		if (!isAuthvalid) throw new HttpException('Authentication Failed', 400);

		// Create Session
		const sessionId = v4();
		const jwtToken = jwt.sign({
			userId: isUserValid.id,
			email,
			role: isUserValid.role,
			sessionId,
		}, this.JWT_SECRET);

		// Update Session for the User
		await this.Authrepo.create_auth_session(isUserValid, isAuthvalid, sessionId);

		// Store push token
		await this.Authrepo.store_expo_push_token(isUserValid, expoPushToken);

		return {
			status: 'ok',
			token: jwtToken,
			role: isUserValid.role,
			email: isUserValid.email,
			name: isUserValid.name,
			flags: {
				donor_registered: isUserValid.donor_registered,
			},
		};
	}

	/// Auth Refresh
	async refresh(authPayload: any) {
		const {
			id, role, email, token,
		} = authPayload;

		/// Fetch User Info
		const user = await this.UserService.viewUser(id);

		const resPayload = {
			id,
			role,
			email,
			token,
			flags: {
				donor_registered: user.donor_registered,
			},
		};

		return resPayload;
	}

	/// Logout
	async logout(authPayload: any) {
		const { sessionId } = authPayload;
		await this.Authrepo.delete_single_session(sessionId);
		await this.Authrepo.delete_expo_push_token(authPayload?.userId);
	}

	/// ////Two Factor Auth - 2FA
	/// /Send OTP
	async sendOtp(email: string) {
		/// /Get User Info
		const user = await this.UserRepo.find_by_email(email);
		if (!user) throw new HttpException('Email not found', 400);

		const otp = randomSixDigitOtp().toString();
		const otpHash = hashSync(otp, 12);
		const signature = jwt.sign({}, this.JWT_SECRET, { expiresIn: '300s' });

		/// //Update OTP for the user
		await this.repo.auth().update({ userId: user.id }, {
			signature, otp: otpHash,
		});

		// TODO - Mail OTP
		this.mailService.sendMail({
			type: 'send_otp',
			to: email,
			context: {
				otp,
			},
		});

		return {
			message: 'OTP sent successfully',
			dev_otp: otp,
		};
	}

	/// /Validate OTP
	async validateOtp(email: string, otp: number) {
		/// /Get User Info
		const user = await this.UserRepo.find_by_email(email);
		if (!user) throw new HttpException('Email not found', 400);

		/// Fetch auth info for User
		const authInfo = await this.Authrepo.get_auth(user.id);
		if (!authInfo) throw new HttpException('Auth Failed', 400);

		/// //Validate OTP
		const { otp: otpHash, signature } = authInfo;
		if (!otpHash || !signature) throw new HttpException('OTP Expired', 400);

		try {
			jwt.verify(signature, this.JWT_SECRET);
		} catch (e) { throw new HttpException('OTP Expired', 400); }

		if (!compareSync(otp.toString(), otpHash)) throw new HttpException('OTP Expired', 400);

		return {
			status: 'ok',
			isValid: true,
		};
	}

	/// /Set Password
	async set_password(email: string, password: string, otp: number) {
		const user = await this.UserRepo.find_by_email(email);
		if (!user) throw new HttpException('User not found', 404);

		/// /Validate OTP
		const isotpValid = await this.validateOtp(email, otp);
		if (!isotpValid.isValid) throw new HttpException('Invalid OTP', 400);

		/// Hash & Update password
		const passwordHash = hashSync(password, 12);

		/// Update User Auth
		await this.Authrepo.update_auth(user.id, {
			password: passwordHash,
		});

		// Reset OTP
		await this.Authrepo.update_auth(user.id, {
			otp: null,
			signature: null,
		});

		return {
			message: 'Password Updated',
		};
	}

	/// /Social Authentication
	async social_auth(payload: SocialAuthDto) {
		const { provider } = payload;

		switch (provider) {
		case SocialAuthTypes.GOOGLE:
			return this.socialAuthService.google_auth(payload);
		case SocialAuthTypes.MICROSOFT:
			return this.socialAuthService.microsoft_auth(payload);
		default:
			throw new HttpException('Invalid Auth Type', 400);
		}
	}
}

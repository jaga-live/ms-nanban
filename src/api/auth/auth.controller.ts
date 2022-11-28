import { Request } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { TYPES } from '../../core/inversify/types';
import { AuthService } from './auth.service';
import 'dotenv/config';
import { SocialAuthDto } from './_dto/auth.dto';
import { Req } from '../../core/custom.types';

@controller('/auth')
export class AuthController {
	constructor(
        @inject(TYPES.AuthService) private readonly authService: AuthService,
	) { }

    /// Social Auth
    @httpPost('/social')
	async socialAuth(req: Request) {
		const payload = await SocialAuthDto.validate(req.body);
		return this.authService.social_auth(payload);
	}

    /// Auth Refresh
    @httpGet(
    	'/refresh',
    	TYPES.AuthGuard,
    )
    async refresh(req: Req) {
    	const authPayload = {
    		...req.userData,
    		token: req.authToken,
    	};
    	return this.authService.refresh(authPayload);
    }

    /// Logout
    @httpGet(
    	'/logout',
    	TYPES.AuthGuard,
    )
    async logout(req: Req) {
    	await this.authService.logout(req.userData);
    	return {
    		message: 'Logged out',
    	};
    }

    /// /Two factor Authentication
    /// ///Send OTP
    @httpGet('/2fa/send_otp/:email')
    async sendOtp(req: Request) {
    	const { email } = req.params;
    	return this.authService.sendOtp(email);
    }

    /// //Validate OTP
    @httpPost('/2fa/otp/validate')
    async validateOtp(req: Request) {
    	const { email, otp } = req.body;
    	return this.authService.validateOtp(email, otp);
    }

    /// Set Password
    @httpPost('/set_password')
    async setPassword(req: Request) {
    	const { email, password, otp } = req.body;
    	return this.authService.set_password(email, password, otp);
    }
}

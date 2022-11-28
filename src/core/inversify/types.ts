export const TYPES = {
	// Service
	AuthService: Symbol('AuthService'),
	SocialAuthService: Symbol('SocialAuthService'),
	UserService: Symbol('UserService'),
	DonorService: Symbol('DonorService'),
	BloodRequestService: Symbol('BloodRequestService'),
	DonorStatusService: Symbol('DonorStatusService'),
	HospitalService: Symbol('HospitalService'),
	BloodService: Symbol('BloodService'),
	MailService: Symbol('MailService'),
	SmsService: Symbol('SmsService'),
	FileService: Symbol('FileService'),

	/// /Repo Service
	RepoService: Symbol('RepoService'),

	// Middleware
	AuthGuard: Symbol('AuthGuard'),
	RolesGuard: Symbol('RolesGuard'),
};

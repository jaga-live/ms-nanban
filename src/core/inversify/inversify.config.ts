import { Container } from 'inversify';
import { IUserService, UserService } from '../../api/users/service/users.service';
import { TYPES } from './types';
import { IMailService, MailService } from '../../shared/mail/mail.service';
import { AuthGuard } from '../../api/auth/middleware/auth.middleware';
import { UserRepository } from '../../api/users/repository/users.repository';
import { AuthService } from '../../api/auth/auth.service';

/// //Controllers
import './global.controllers';

import { Repository } from '../../database/sql';
import { AuthRepository } from '../../api/auth/repository/auth.repository';
import { SocialAuthService } from '../../api/auth/social_auth.service';
import { DonorService, IDonorService } from '../../api/donor/service/donor.service';
import { DonorRepository } from '../../api/donor/repository/donor.repository';
import { BloodRequestService, IBloodRequestService } from '../../api/blood_request/service/blood_request.service';
import { BloodRequestRepository } from '../../api/blood_request/repository/blood_request.repository';
import { HospitalRepository } from '../../api/hospital/repository/hospital.repository';
import { HospitalService, IHospitalService } from '../../api/hospital/service/hospital.service';
import { SmsService } from '../../shared/sms/sms.service';
import { DonorStatusService, IDonorStatusService } from '../../api/donor_status/service/donor_status.service';
import { DonorStatusRepository } from '../../api/donor_status/repository/donor_status.repository';
import { MailFactory } from '../../shared/mail/factory/mail.factory';
import { BloodService, IBloodService } from '../../api/blood/service/blood.service';
import { BloodRepository } from '../../api/blood/repository/blood.repository';
import { FileService } from '../../shared/file/file.service';

export const container = new Container({
	defaultScope: 'Singleton',
});

/// ////Bindings

/// /Middleware
container.bind<AuthGuard>(TYPES.AuthGuard).to(AuthGuard);

/// //Service
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<SocialAuthService>(TYPES.SocialAuthService).to(SocialAuthService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IMailService>(TYPES.MailService).to(MailService);
container.bind<SmsService>(TYPES.SmsService).to(SmsService);
container.bind<IDonorService>(TYPES.DonorService).to(DonorService);
container.bind<IBloodRequestService>(TYPES.BloodRequestService).to(BloodRequestService);
container.bind<IHospitalService>(TYPES.HospitalService).to(HospitalService);
container.bind<IDonorStatusService>(TYPES.DonorStatusService).to(DonorStatusService);
container.bind<IBloodService>(TYPES.BloodService).to(BloodService);
container.bind<FileService>(TYPES.FileService).to(FileService);
/// /Repository Service
container.bind<Repository>(TYPES.RepoService).to(Repository);

/// //Repository
container.bind(UserRepository).toSelf();
container.bind(AuthRepository).toSelf();
container.bind(DonorRepository).toSelf();
container.bind(BloodRequestRepository).toSelf();
container.bind(HospitalRepository).toSelf();
container.bind(DonorStatusRepository).toSelf();
container.bind(BloodRepository).toSelf();

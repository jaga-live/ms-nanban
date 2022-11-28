import { mock } from 'jest-mock-extended';
import { HttpException } from '../../../core/exception';
import { MailService } from '../../../shared/mail/mail.service';
import { AuthRepository } from '../../auth/repository/auth.repository';
import { createUserFixture, userFixture } from '../fixtures/userFixture';
import { UserRepository } from '../repository/users.repository';
import { UserService } from '../service/users.service';

// Mocks
const UserRepoMock = mock<UserRepository>();
const AuthRepoMock = mock<AuthRepository>();
const MailServiceMock = mock<MailService>();

describe('User Service', () => {
	const sut: UserService = new UserService(
		UserRepoMock,
		AuthRepoMock,
		MailServiceMock,
	);

	beforeEach(() => {
	});

	/// Define User Service
	test('User service should be defined', () => {
		expect(sut).toBeDefined();
	});

	/// Signup User
	test('throw error if user already exists', () => {
		UserRepoMock.find_by_email.mockResolvedValueOnce(userFixture[0]);
		expect(sut.signupUser(createUserFixture)).rejects.toThrowError(HttpException);
	});
});

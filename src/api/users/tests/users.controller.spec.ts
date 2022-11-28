import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import request from 'supertest';
import { MailService } from '../../../shared/mail/mail.service';
import { UserController } from '../controller/users.controller';
import { UserService } from '../service/users.service';
import { ValidationException } from '../../../core/exception';
import { createUserFixture, updateUserFixture, userFixture } from '../fixtures/userFixture';
import { bootstrap } from '../../../main';

const userServiceMock = mock<UserService>();
const mailServiceMock = mock<MailService>();

describe('Users Controller', () => {
	let sut: UserController;
	sut = new UserController(userServiceMock, mailServiceMock);

	beforeEach(async () => {
		userServiceMock.signupUser.mockResolvedValueOnce(userFixture[0]);
		userServiceMock.viewUsers.mockResolvedValueOnce(userFixture);
		userServiceMock.viewUser.mockResolvedValueOnce(userFixture[0]);
		userServiceMock.editUser.mockResolvedValueOnce(userFixture[0]);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	/// User Signup
	test('User Signup', () => {
		expect(sut).toBeDefined();
	});

	test('should not throw validation exception', async () => {
		const reqFixture: any = createUserFixture;
		expect(sut.signup(reqFixture)).resolves.not.toThrowError(ValidationException);
	});

	test('should throw validation exception', () => {
		const reqFixture: any = createUserFixture;
		delete reqFixture.body.role;
		expect(sut.signup(reqFixture)).rejects.toThrowError(ValidationException);
	});
	test('should not call create user service if validation fails', async () => {
		const reqFixture: any = createUserFixture;
		delete reqFixture.body.role;

		await sut.signup(reqFixture).catch(() => {
			expect(userServiceMock.signupUser).not.toHaveBeenCalled();
		});
	});

	/// View Users
	test('view all users', async () => {
		const response = await sut.view_users();
		expect(response).toBe(userFixture);
	});

	test('user profile', async () => {
		const reqFixture: any = createUserFixture;
		const response = await sut.user_profile(reqFixture);
		expect(response).toBe(userFixture[0]);
	});

	/// Edit User
	test('should throw error while passing sensitive data on update', async () => {
		const editFixture: any = createUserFixture;
		expect(sut.update_user(editFixture)).rejects.toThrow(ValidationException);
	});
});

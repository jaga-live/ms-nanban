import { injectable } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Auth, AuthSession, ExpoPushToken } from '../api/auth/model/auth.model';
import { User } from '../api/users/model/users.model';
import 'dotenv/config';
import { Donor } from '../api/donor/model/donor.model';
import { BloodRequest } from '../api/blood_request/model/blood_request.model';
import { Hospital } from '../api/hospital/model/hospital.model';
import { DonorStatus } from '../api/donor_status/model/donor_status.model';
import { Blood } from '../api/blood/model/blood.model';

const Entities = [
	User, Auth, AuthSession, Blood, Donor, BloodRequest, Hospital, DonorStatus, ExpoPushToken,
];

const AppDataSource = new DataSource({
	type: 'mssql',
	host: process.env.SQLSERVER_HOST,
	port: parseInt(process.env.SQLSERVER_PORT) as number,
	username: process.env.SQLSERVER_USER,
	password: process.env.SQLSERVER_PASS,
	database: process.env.SQLSERVER_DB,
	entities: Entities,
	synchronize: true,
	logging: false,
	extra: {
		trustServerCertificate: true,
	},
});

/// ///Connect to Microsoft SQL Server
export class Sql {
	public connect() {
		AppDataSource.initialize()
			.then((res) => {
				console.log('SQL Server Connected');
			})
			.catch((error) => console.log(error));
	}
}

/// ///Repository service
@injectable()
export class Repository {
	/// Users
	public user() {
		const userRepo = AppDataSource.getRepository(User);
		return userRepo;
	}

	/// Auth
	public auth() {
		const authRepo = AppDataSource.getRepository(Auth);
		return authRepo;
	}

	/// Auth Session
	public auth_session() {
		const authSessionRepo = AppDataSource.getRepository(AuthSession);
		return authSessionRepo;
	}

	/// Auth Session
	public donor() {
		const donorRepo = AppDataSource.getRepository(Donor);
		return donorRepo;
	}

	// Blood request
	public blood_request() {
		const bloodRequestRepo = AppDataSource.getRepository(BloodRequest);
		return bloodRequestRepo;
	}

	// donorStatus
	public donor_status() {
		const donorStatusRepo = AppDataSource.getRepository(DonorStatus);
		return donorStatusRepo;
	}

	// blood mapping
	public blood() {
		const bloodRepo = AppDataSource.getRepository(Blood);
		return bloodRepo;
	}

	// Hospital
	public hospital() {
		const hospitalRepo = AppDataSource.getRepository(Hospital);
		return hospitalRepo;
	}

	// Push
	public expo_expo_push_token() {
		const pushToken = AppDataSource.getRepository(ExpoPushToken);
		return pushToken;
	}
}

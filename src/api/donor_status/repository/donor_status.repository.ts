import { compareSync } from 'bcrypt';
import { inject, injectable } from 'inversify';
import { BloodRequest } from '../../blood_request/model/blood_request.model';
import { HttpException } from '../../../core/exception';
import { TYPES } from '../../../core/inversify/types';
import { Repository } from '../../../database/sql';
import { DonorStatus } from '../model/donor_status.model';
import { DonorService } from '../../donor/service/donor.service';
import { DonorRepository } from '../../donor/repository/donor.repository';
import { Console } from 'console';

@injectable()
export class DonorStatusRepository {
	constructor(
		@inject(TYPES.RepoService) private readonly repo: Repository,
		@inject(DonorRepository) private readonly donorRepo: DonorRepository,
	) { }

	// save donor status
	async saveDonorStatus(payload: any) {
		let donorStatus = new DonorStatus();
		donorStatus = { ...payload };

		await this.repo.donor_status().save(payload);
		return donorStatus;
	}

	// find all donor
	async find_all_donor_status() {
		const allDonorStatus = await this.repo.donor_status().find();
		return allDonorStatus;
	}

	// find donorstatus by id
	async find_donor_status_by_id(id : number) {
		const donorStatusById = await this.repo.donor_status().findOneBy({ id });
		return donorStatusById;
	}

	// find donor status by donor id
	async find_donor_status_by_donor_id(donor_id : number) {
		const donorStatusByDonorId = await this.repo.donor_status().findOneBy({ donor_id });
		if (!donorStatusByDonorId) throw new HttpException('Id not found', 400);
		return donorStatusByDonorId;
	}

	// find donor status by blood request id
	async find_donor_status_by_blood_request_id(blood_request_id : number) {
		const donorStatusByBloodReqId = await this.repo.donor_status().findOneBy({ blood_request_id });
		if (!donorStatusByBloodReqId) throw new HttpException('Blood request not found', 400);
		return donorStatusByBloodReqId;
	}

	///View all Blood request based
	async get_blood_request_by_status(userId: number, status: string): Promise<any> {
		const donor = await this.donorRepo.find_donor_by_id(userId);
		if (!donor) throw new HttpException('Donor not found', 400);
		const { id } = donor;
		return await this.repo.donor()
			.query(`SELECT r.id, requester_name, r.blood_group, r.hospital_name,
			r.gender, r.required_units, r.type_of_request, r.created_at, s.status, s.donor_id
                                        FROM blood_request r
                                        JOIN donor_status s
                                        ON r.id = s.blood_request_id
                                        WHERE s.status= '${status}' AND s.donor_id = ${id};`);
	}

	// delete donor status by id
	async delete_donor_status_by_donor_id(donor_id: number) {
		const deleteDonorStatusById = await this.find_donor_status_by_donor_id(donor_id);
		if (!deleteDonorStatusById) throw new HttpException('Donor Id not found', 400);

		await this.repo.donor_status().remove(deleteDonorStatusById);
		return deleteDonorStatusById;
	}


	// accept or reject blood request
	async update_donor_status(blood_request_id: number, donor_id: number, status: string): Promise<any> {
		console.log(blood_request_id, donor_id, status);
		await this.repo.donor_status()
			.createQueryBuilder('donor_status')
			.update()
			.set({ status })
			.where('donor_id = :donor_id', { donor_id })
			.andWhere('blood_request_id = :blood_request_id', { blood_request_id })
			.execute();
	}

	// complete the flow
	async confirm_otp(blood_request_id: number, donor_id: number, otp: string): Promise<any> {
		const bloodRequest = await this.repo.blood_request()
			.createQueryBuilder('blood_request')
			.where('id = :blood_request_id', { blood_request_id })
			.getOne();

		const donor_status = await this.repo.donor_status()
		.createQueryBuilder('donor_status')
		.where('donor_id = :donor_id', { donor_id })
		.andWhere('blood_request_id = :blood_request_id', { blood_request_id })
		.getOne();
		
		// already verified
		if (donor_status.otp_verified) throw new HttpException('OTP already verified', 401);

		// verify otp
		const verifiedOtp = compareSync(otp, bloodRequest.otp);
		if (!verifiedOtp) throw new HttpException('Invalid OTP', 401);

		return await this.repo.donor_status()
			.createQueryBuilder('donor_status')
			.update()
			.set({ otp_verified: true, completed_date: new Date(), status: 'DONATION_COMPLETE' })
			.where('donor_id = :donor_id', { donor_id })
			.andWhere('blood_request_id = :blood_request_id', { blood_request_id })
			.execute();
	}

	// donor blood request list
	async getDonorBloodRequsetList(donor_id : number) {
		const donorBloodRequestList = await this.repo.donor_status()
			.query(`SELECT donor_id,blood_request_id,
             blood_group, full_name, is_accepted, 
             created_at FROM donor LEFT JOIN donor_status
             ON ${donor_id} = donor_status.donor_id`);

		return donorBloodRequestList;
	}

	// certificate details by blood request id
	async get_certificate_details_by_blood_req_id(id: number): Promise<any> {
		return await this.repo.blood_request()
			.query(`SELECT d.full_name, ds.completed_date, br.required_units, br.hospital_name
                                        FROM blood_request br
                                        JOIN donor_status ds
                                        ON br.id = ds.blood_request_id
                                        JOIN donor d
                                        ON ds.donor_id = d.id
                                        WHERE br.id = ${id};`);
	}
}

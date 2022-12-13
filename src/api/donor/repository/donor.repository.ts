import { inject, injectable } from 'inversify';
import { HttpException } from '../../../core/exception';
import { TYPES } from '../../../core/inversify/types';
import { Repository } from '../../../database/sql';
import { Donor } from '../model/donor.model';

@injectable()
export class DonorRepository {
	constructor(
        @inject(TYPES.RepoService) private readonly repo : Repository,
	) { }

	/// Create
	async create_donor(userId: number, payload: any) {
		let donor = new Donor();
		donor = { ...payload };
		donor.userId = userId;

		await this.repo.donor().save(donor);
		return donor;
	}

	// GET
	// find all donors
	async find_all_donor() {
		const donors = await this.repo.donor().find();
		return donors;
	}

	// find donor by id
	async find_donor_by_id(userId: number) {
		const donor = await this.repo.donor().findOneBy({ userId });
		return donor;
	}

	// find donor by id
	async find_donor_by_userId(userId: number) {
		const donor = await this.repo.donor().findOneBy({ userId });
		return donor;
	}

	// patch

	async update_donor_by_id(id: number) {
		const donor = await this.repo.donor().findOneBy({ id });
		if (!donor) throw new HttpException('Donor not fount', 400);
	}

	// delete donor by id
	async delete_donor_by_id(id: number) {
		const donor = await this.find_donor_by_id(id);
		if (!donor) throw new HttpException('Donor not found', 400);
		await this.repo.donor().remove(donor);
		return donor;
	}

	// donor push tokens by donor id
	async get_donor_expo_push_tokens_by_id(id: number): Promise<any> {
		const donor = await this.find_donor_by_id(id);
		return await this.repo.expo_expo_push_token()
			.createQueryBuilder('expo_push_token')
			.where('userId = :id', { id })
			.addSelect('expo_push_token')
			.getMany();
	}



	// list of accepted donation
	async list_accepted_donation(userId: number): Promise<any> {
		const donor = await this.find_donor_by_id(userId);
		if (!donor) throw new HttpException('Donor not found', 400);
		const { id } = donor;
		return await this.repo.donor()
			.query(`SELECT r.id, requester_name, r.blood_group, r.hospital_name, s.status, s.donor_id
                                        FROM blood_request r
                                        JOIN donor_status s
                                        ON r.id = s.blood_request_id
                                        WHERE s.status = 'ACCEPTED' AND s.donor_id = ${id};`);
	}

	// list of rejected donation
	async list_rejected_donation(id: number): Promise<any> {
		const donor = await this.find_donor_by_id(id);
		if (!donor) throw new HttpException('Donor not found', 400);
		return await this.repo.donor()
			.query(`SELECT r.id, requester_name, r.blood_group, r.hospital_name, s.status, s.donor_id
                                        FROM blood_request r
                                        JOIN donor_status s
                                        ON r.id = s.blood_request_id
                                        WHERE s.status = 'REJECTED' AND s.donor_id = ${id};`);
	}

	// list of successful donation
	async list_successful_donation(id: number): Promise<any> {
		const donor = await this.find_donor_by_id(id);
		if (!donor) throw new HttpException('Donor not found', 400);
		return await this.repo.donor()
			.query(`SELECT r.id, requester_name, r.blood_group, r.hospital_name, s.status, s.donor_id
                                        FROM blood_request r
                                        JOIN donor_status s
                                        ON r.id = s.blood_request_id
                                        WHERE s.status = 'ACCEPTED' AND s.donor_id = ${id} AND s.otp_verified = 1;`);
	}
}

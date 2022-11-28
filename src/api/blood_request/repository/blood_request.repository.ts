import { inject, injectable } from 'inversify';
import { HttpException } from '../../../core/exception';
import { TYPES } from '../../../core/inversify/types';
import { Repository } from '../../../database/sql';
import { BloodRequest } from '../model/blood_request.model';

@injectable()
export class BloodRequestRepository {
	constructor(
        @inject(TYPES.RepoService) private readonly repo : Repository,
	) {
	}

	// create blood request
	async createBloodRequest(payload: any) {
		let bloodRequest = new BloodRequest();
		bloodRequest = { ...payload };

		const response = await this.repo.blood_request().save(payload);
		return response;
	}

	// find all blood requests
	async find_all_blood_request() {
		const bloodRequest = await this.repo.blood_request().find();
		return bloodRequest;
	}

	// find blood request by id
	async find_blood_request_by_id(id : number) {
		const bloodRequest = await this.repo.blood_request().findOneBy({ id });
		return bloodRequest;
	}

	// patch
	async update_blood_request_by_id(id : number) {
		const bloodRequest = await this.repo.blood_request().findOneBy({ id });
		if (!bloodRequest) throw new HttpException('Blood Request Not Found', 400);
	}

	// delete blood request by id
	async delete_blood_request_by_id(id : number) {
		const bloodRequest = await this.find_blood_request_by_id(id);
		if (!bloodRequest) throw new HttpException('Blood Request Not Found', 400);

		await this.repo.blood_request().remove(bloodRequest);
		return bloodRequest;
	}

	// filtering donor for requested blood request
	async filter_blood_request(pin: number, blood_group: string): Promise<any> {
		const donorDetails = await this.repo.donor()
			.createQueryBuilder('donor')
			.where('donor.pin = :pin', { pin })
			.andWhere('donor.blood_group = :blood_group', { blood_group })
			.getMany();
		return donorDetails;
	}

	// filtering donor for requested blood request by blood group
	async filter_blood_request_by_blood_group(blood_group: string[], pin_code: number): Promise<any> {
		let donorDetails = await this.repo.donor()
			.createQueryBuilder('donor')
			.where('donor.blood_group IN (:...blood_group)', { blood_group })
			.andWhere('donor.pin = :pin_code', { pin_code })
			.getMany();

		if (donorDetails.length > 0) return donorDetails;

		donorDetails = await this.repo.donor()
			.createQueryBuilder('donor')
			.where('donor.blood_group IN (:...blood_group)', { blood_group })
			.getMany();

		return donorDetails;
	}

	async get_matching_blood_request(blood_group: string) {
		const matching_blood_groups = await this.repo.blood()
			.query(`
                                        SELECT matching_blood_group 
                                        FROM blood where 
                                        blood_Group LIKE ('${blood_group}')`);

		return matching_blood_groups.map((res) => res.matching_blood_group);
	}
}

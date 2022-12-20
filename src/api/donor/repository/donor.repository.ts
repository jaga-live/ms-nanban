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
	async find_donor_by_id(id: number) {
		const donor = await this.repo.donor().findOneBy({ id });
		return donor;
	}

	// find donor by userId
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
	async get_donor_expo_push_tokens_by_id(userId: number): Promise<any> {
		return await this.repo.expo_expo_push_token()
			.createQueryBuilder('expo_push_token')
			.where('userId = :userId', { userId })
			.addSelect('expo_push_token')
			.getMany();
	}

}

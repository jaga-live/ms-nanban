import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/inversify/types';
import { Repository } from '../../../database/sql';
import { BloodBank } from '../model/blood_bank.model';

@injectable()
export class BloodBankRepository {
	constructor(
        @inject(TYPES.RepoService) private readonly repo: Repository,
	) { }

	/// Create
	async create(payload: BloodBank) {
		let bloodBank = new BloodBank();
		bloodBank = { ...payload };

		const saveBloodBank = await this.repo.blood_bank().save(bloodBank);
		return saveBloodBank;
	}

	/// Create Multiple
	async create_multiple(payload: BloodBank[]) {
		const saveBloodBank = await this.repo.blood_bank().createQueryBuilder()
			.insert()
			.into(BloodBank)
			.values(payload)
			.execute();
		return saveBloodBank;
	}

	/// Find all
	async findAll() {
		const bloodBanks = await this.repo.blood_bank().find();
		return bloodBanks;
	}

	/// Find by id
	async findById(id: number) {
		const bloodBank = await this.repo.blood_bank().findOneBy({ id });
		return bloodBank;
	}

	///Find by status
	async findByStatus(status: string) {
		const bloodBank = await this.repo.blood_bank().find({
			where: {
				approvalStatus: status
			} });
		return bloodBank;
	}

	/// Edit Single
	async editOne(id: number, payload: any): Promise<any> {
		await this.repo.blood_bank().update({ id }, { ...payload });
		return payload;
	}

	/// Delete One
	async deleteOne(id: number) {
		await this.repo.blood_bank().delete(id);
	}
}

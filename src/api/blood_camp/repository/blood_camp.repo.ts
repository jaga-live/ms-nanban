import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/inversify/types';
import { Repository } from '../../../database/sql';
import { BloodCamp } from '../model/blood_camp.model';

@injectable()
export class BloodCampRepository {
	constructor(
        @inject(TYPES.RepoService) private readonly repo: Repository,
	) { }

	/// Create
	async create(payload: BloodCamp) {
		let bloodCamp = new BloodCamp();
		bloodCamp = { ...payload };

		const saveBloodCamp = await this.repo.blood_camp().save(bloodCamp);
		return saveBloodCamp;
	}

	/// Create Multiple
	async create_multiple(payload: BloodCamp[]) {
		const saveBloodCamp = await this.repo.blood_camp().createQueryBuilder()
			.insert()
			.into(BloodCamp)
			.values(payload)
			.execute();
		return saveBloodCamp;
	}

	/// Find all
	async findAll() {
		const bloodCamps = await this.repo.blood_camp().find();
		return bloodCamps;
	}

	/// Find by id
	async findById(id: number) {
		const bloodCamp = await this.repo.blood_camp().findOneBy({ id });
		return bloodCamp;
	}

	/// Find by status
	async findByStatus(status: string) {
		const bloodCamp = await this.repo.blood_camp().find({
			where: {
				approvalStatus: status
			} });
		return bloodCamp;
	}

	/// Edit Single
	async editOne(id: number, payload: any): Promise<any> {
		await this.repo.blood_camp().update({ id }, { ...payload });
		return payload;
	}

	/// Delete One
	async deleteOne(id: number) {
		await this.repo.blood_camp().delete(id);
	}
}

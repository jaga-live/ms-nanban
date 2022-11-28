import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/inversify/types';
import { Repository } from '../../../database/sql';
import { Hospital } from '../model/hospital.model';
import { EditHospitalDto } from '../_dto/hospital.dto';

@injectable()
export class HospitalRepository {
	constructor(
        @inject(TYPES.RepoService) private readonly repo: Repository,
	) { }

	/// Create
	async create(payload: Hospital) {
		let hospital = new Hospital();
		hospital = { ...payload };

		const saveHospital = await this.repo.hospital().save(hospital);
		return saveHospital;
	}

	/// Create Multiple
	async create_multiple(payload: Hospital[]) {
		const saveHospital = await this.repo.hospital().createQueryBuilder()
			.insert()
			.into(Hospital)
			.values(payload)
			.execute();
		return saveHospital;
	}

	/// Find all
	async findAll() {
		const hospitals = await this.repo.hospital().find();
		return hospitals;
	}

	/// Find by id
	async findById(id: number) {
		const hospital = await this.repo.hospital().findOneBy({ id });
		return hospital;
	}

	/// Edit Single
	async editOne(id: number, payload: any): Promise<any> {
		await this.repo.hospital().update({ id }, { ...payload });
		return payload;
	}

	/// Delete One
	async deleteOne(id: number) {
		await this.repo.hospital().delete(id);
	}
}

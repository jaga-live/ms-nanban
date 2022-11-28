import { inject, injectable } from 'inversify';

import { TYPES } from '../../../core/inversify/types';
import { Repository } from '../../../database/sql';
import { Blood } from '../model/blood.model';

@injectable()
export class BloodRepository {
	constructor(@inject(TYPES.RepoService) private readonly repo : Repository) {}

	// save mapped blood groups
	async saveMappingBlood(payload : any[]) {
		const isdelete_blood_group = await this.repo.blood().createQueryBuilder()
			.delete()
			.from(Blood)
			.execute();

		const response = await this.repo.blood().createQueryBuilder()
			.insert()
			.into(Blood)
			.values(payload)
			.execute();

		return response;
	}

	// get saved blood group
	async mappedBloodGroup() {
		let blood_Groups = await this.repo.blood()
			.query(`SELECT blood_group , matching_blood_group FROM 
                          blood GROUP BY blood_group,
                          matching_blood_group`);

		const key = 'blood_group';
		blood_Groups = blood_Groups.reduce((data, x) => {
			(data[x[key]] = data[x[key]] || []).push(x.matching_blood_group);
			return data;
		}, {});

		return blood_Groups;
	}
}

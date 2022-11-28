import { inject, injectable } from 'inversify';
import { BloodRepository } from '../repository/blood.repository';

export interface IBloodService{
    saveBloodGroupMapping(payload : any): Promise<any>

}

@injectable()
export class BloodService implements IBloodService {
	constructor(
        @inject(BloodRepository) private readonly repo : BloodRepository,
	) {}

	async saveBloodGroupMapping(payload : any) {
		const bloodGroups = Object.keys(payload)
			.map((blood_group) => (payload[blood_group]).map((matching_blood_group) => ({
				blood_group,
				matching_blood_group,
			})))
			.flat(1);
		const saveBloodGroupMapping = await this.repo.saveMappingBlood(bloodGroups);
		return saveBloodGroupMapping;
	}

	async getMappedBloodGroups() {
		const bloodList = await this.repo.mappedBloodGroup();
		return bloodList;
	}
}

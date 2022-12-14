import { inject, injectable } from 'inversify';
import { HttpException } from '../../../core/exception';
import { BloodCamp } from '../model/blood_camp.model';
import { BloodCampRepository } from '../repository/blood_camp.repo';
import { CreateBloodCampDto, EditBloodCampDto } from '../_dto/blood_camp.dto';

export interface IBloodCampService{
    register_bloodCamp(payload: BloodCamp): Promise<BloodCamp>
    create_multiple_bloodCamp(payload: BloodCamp[])
    view_all_bloodCamp(): Promise<BloodCamp[]>
    view_single_bloodCamp(id: number): Promise<BloodCamp>
    edit_single_bloodCamp(id: number, payload: EditBloodCampDto): Promise<BloodCamp>
    delete_bloodCamp(id: number): Promise<any>
}

@injectable()
export class BloodCampService implements IBloodCampService {
	constructor(
        @inject(BloodCampRepository) private readonly bloodCampRepo: BloodCampRepository,
	) { }

	///Register BloodCamp
	async register_bloodCamp(payload: BloodCamp): Promise<BloodCamp> {
		payload.approvalStatus = 'REQUESTED';
		return this.bloodCampRepo.create(payload);
	}

	async create_multiple_bloodCamp(payload: any) {
		return this.bloodCampRepo.create_multiple(payload);
	}

	async view_all_bloodCamp(): Promise<BloodCamp[]> {
		return this.bloodCampRepo.findAll();
	}

	async view_single_bloodCamp(id: number): Promise<BloodCamp> {
		const bloodCamp = await this.bloodCampRepo.findById(id);
		if (!bloodCamp) throw new HttpException('BloodCamp Not found', 400);
		return bloodCamp;
	}

	async edit_single_bloodCamp(id: number, payload: EditBloodCampDto): Promise<any> {
		const bloodCamp = await this.bloodCampRepo.findById(id);
		if (!bloodCamp) throw new HttpException('BloodCamp Not found', 400);

		return this.bloodCampRepo.editOne(id, payload);
	}

	async delete_bloodCamp(id: number) {
		const isBloodCampValid = await this.view_single_bloodCamp(id);
		if (!isBloodCampValid) throw new HttpException('BloodCamp Not found', 400);

		return this.bloodCampRepo.deleteOne(id);
	}
}

import { inject, injectable } from 'inversify';
import { HttpException } from '../../../core/exception';
import { Hospital } from '../model/hospital.model';
import { HospitalRepository } from '../repository/hospital.repository';
import { CreateHospitalDto, EditHospitalDto } from '../_dto/hospital.dto';

export interface IHospitalService{
    create_hospital(payload: Hospital): Promise<Hospital>
    create_multiple_hospital(payload: Hospital[])
    view_all_hospital(): Promise<Hospital[]>
    view_single_hospital(id: number): Promise<Hospital>
    edit_single_hospital(id: number, payload: EditHospitalDto): Promise<Hospital>
    delete_hospital(id: number): Promise<any>
}

@injectable()
export class HospitalService implements IHospitalService {
	constructor(
        @inject(HospitalRepository) private readonly hospitalRepo: HospitalRepository,
	) { }

	/// Create Hospital
	async create_hospital(payload: Hospital): Promise<Hospital> {
		return this.hospitalRepo.create(payload);
	}

	async create_multiple_hospital(payload: any) {
		return this.hospitalRepo.create_multiple(payload);
	}

	async view_all_hospital(): Promise<Hospital[]> {
		return this.hospitalRepo.findAll();
	}

	async view_single_hospital(id: number): Promise<Hospital> {
		const hospital = await this.hospitalRepo.findById(id);
		if (!hospital) throw new HttpException('Hospital Not found', 400);
		return hospital;
	}

	async edit_single_hospital(id: number, payload: EditHospitalDto): Promise<any> {
		const hospital = await this.hospitalRepo.findById(id);
		if (!hospital) throw new HttpException('Hospital Not found', 400);

		return this.hospitalRepo.editOne(id, payload);
	}

	async delete_hospital(id: number) {
		const isHospitalValid = await this.view_single_hospital(id);
		if (!isHospitalValid) throw new HttpException('Hospital Not found', 400);

		return this.hospitalRepo.deleteOne(id);
	}
}

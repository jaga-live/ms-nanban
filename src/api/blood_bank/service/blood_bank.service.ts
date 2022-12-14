import { inject, injectable } from 'inversify';
import { HttpException } from '../../../core/exception';
import { BloodBank } from '../model/blood_bank.model';
import { BloodBankRepository } from '../repository/blood_bank.repository';
import { CreateBloodBankDto, EditBloodBankDto } from '../_dto/blood_bank.dto';

export interface IBloodBankService{
    register_bloodBank(payload: BloodBank): Promise<BloodBank>
    create_multiple_bloodBank(payload: BloodBank[])
    view_all_bloodBank(): Promise<BloodBank[]>
	view_single_bloodBank(id: number): Promise<BloodBank>
	view_bloodBank_by_status(status: string): Promise<BloodBank[]>
    edit_single_bloodBank(id: number, payload: EditBloodBankDto): Promise<BloodBank>
    delete_bloodBank(id: number): Promise<any>
}

@injectable()
export class BloodBankService implements IBloodBankService {
	constructor(
        @inject(BloodBankRepository) private readonly bloodBankRepo: BloodBankRepository,
	) { }

	///Register BloodBank
	async register_bloodBank(payload: BloodBank): Promise<BloodBank> {
		payload.approvalStatus = 'REQUESTED';
		return this.bloodBankRepo.create(payload);
	}

	async create_multiple_bloodBank(payload: any) {
		return this.bloodBankRepo.create_multiple(payload);
	}

	async view_all_bloodBank(): Promise<BloodBank[]> {
		return this.bloodBankRepo.findAll();
	}

	async view_single_bloodBank(id: number): Promise<BloodBank> {
		const bloodBank = await this.bloodBankRepo.findById(id);
		if (!bloodBank) throw new HttpException('BloodBank Not found', 400);
		return bloodBank;
	}

	async view_bloodBank_by_status(status: string): Promise<BloodBank[]> {
		const bloodBank = await this.bloodBankRepo.findByStatus(status);
		if (!bloodBank) throw new HttpException('BloodBank Not found', 400);
		return bloodBank;
	}

	async edit_single_bloodBank(id: number, payload: EditBloodBankDto): Promise<any> {
		const bloodBank = await this.bloodBankRepo.findById(id);
		if (!bloodBank) throw new HttpException('BloodBank Not found', 400);

		return this.bloodBankRepo.editOne(id, payload);
	}

	async delete_bloodBank(id: number) {
		const isBloodBankValid = await this.view_single_bloodBank(id);
		if (!isBloodBankValid) throw new HttpException('BloodBank Not found', 400);

		return this.bloodBankRepo.deleteOne(id);
	}
}

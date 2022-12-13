import { inject, injectable } from 'inversify';
import { HttpException } from '../../../core/exception';
import { TYPES } from '../../../core/inversify/types';
import { UserService } from '../../users/service/users.service';
import { DonorRepository } from '../repository/donor.repository';
import { CreateDonorDto } from '../_dto/donor.dto';

export interface IDonorService{
    createDonor(userId: number, payload: CreateDonorDto): Promise<any>
    viewDonors(): Promise<any>
    viewDonor(id : number): Promise<any>
    editDonorById(id: number): Promise<any>
    deleteDonor(id : number): Promise<any>
    // deleteUsers(): Promise<any>
}

@injectable()
export class DonorService implements IDonorService {
	constructor(
        @inject(DonorRepository) private readonly donor: DonorRepository,
        @inject(TYPES.UserService) private readonly userService: UserService,
	) {}

	/// ///Create
	/// Create Donor
	async createDonor(userId: number, payload: CreateDonorDto) {
		const isUserValid = await this.userService.viewUser(userId);
		if (!isUserValid) throw new HttpException('User not found', 400);

		/// Validate Donor
		const checkDonor = await this.viewDonorByUser(userId);
		if (checkDonor) throw new HttpException('Donor already exists', 409);

		const saveDonor = await this.donor.create_donor(userId, payload);
		/// //Update donor registration status
		await this.userService.editUser(userId, { donor_registered: true });

		return saveDonor;
	}

	// view all donor
	async viewDonors() {
		const donors = await this.donor.find_all_donor();
		return donors;
	}

	// view donor by id
	async viewDonor(id : number) {
		const donor = await this.donor.find_donor_by_id(id);
		return donor;
	}

	/// view donor by userId
	async viewDonorByUser(userId: number) {
		const donor = await this.donor.find_donor_by_userId(userId);
		return donor;
	}

	// edit donor by id
	async editDonorById(id : number) {
		const donor = await this.donor.update_donor_by_id(id);
		return donor;
	}

	// delete donor by id
	async deleteDonor(id: number) {
		const donor = await this.donor.delete_donor_by_id(id);
		return donor;
	}

	// push tokens by donor id
	async get_donor_expo_push_tokens_by_id(id: number): Promise<any> {
		return await this.donor.get_donor_expo_push_tokens_by_id(id);
	}

	// view all blood requests
	async view_all_blood_Request(userId: number) {
		return await this.donor;
	}

	// list accepted donation list for donor
	async list_accepted_donation(userId: number): Promise<any> {
		return await this.donor.list_accepted_donation(userId);
	}

	// list rejected donation list for donor
	async list_rejected_donation(id: number): Promise<any> {
		return await this.donor.list_rejected_donation(id);
	}

	// list successful donation list for donor
	async list_sucessful_donation(id: number): Promise<any> {
		return await this.donor.list_successful_donation(id);
	}
}

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

	////GET
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
	
	// push tokens by donor id
	async get_donor_expo_push_tokens_by_id(id: number): Promise<any> {
		return await this.donor.get_donor_expo_push_tokens_by_id(id);
	}


	///PATCH
	// edit donor by id
	async editDonorById(id : number) {
		const donor = await this.donor.update_donor_by_id(id);
		return donor;
	}

	///DELETE
	// delete donor by id
	async deleteDonor(id: number) {
		const donor = await this.donor.delete_donor_by_id(id);
		return donor;
	}


}

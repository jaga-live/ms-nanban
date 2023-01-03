import { inject, injectable } from 'inversify';
import { HttpException } from '../../../core/exception';
import { container } from '../../../core/inversify/inversify.config';
import { TYPES } from '../../../core/inversify/types';
import { BloodRequestService } from '../../blood_request/service/blood_request.service';
import { UserService } from '../../users/service/users.service';
import { DonorRepository } from '../repository/donor.repository';
import { CreateDonorDto } from '../_dto/donor.dto';
import { DonorProfile } from '../_dto/donor_profile.dto';

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
	///Donro profile
	async profile(userId: number) {
		const user = await this.userService.viewUser(userId);
		const donor = await this.donor.find_donor_by_userId(userId);

		///Check donor donation eligibility
		const bloodRequestService = container.get<BloodRequestService>(TYPES.BloodRequestService);
		const getDonationEligibility = await bloodRequestService.find_donor_notification_eligibility(donor.id);

		const donorProfile = new DonorProfile(
			user.id,
			donor.full_name,
			donor.email,
			'donor',
			user.donor_registered,
			getDonationEligibility || false,
		);
		return donorProfile;
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
	
	// push tokens by donor id
	async get_donor_expo_push_tokens_by_id(userId: number): Promise<any> {
		return await this.donor.get_donor_expo_push_tokens_by_id(userId);
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

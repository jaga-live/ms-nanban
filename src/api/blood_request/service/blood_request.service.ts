import { hashSync } from 'bcrypt';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/inversify/types';
import { randomSixDigitOtp } from '../../../helper/calc';
import { PushToken, sendPushNotification } from '../../../shared/push_notification';
import { SmsTypes } from '../../../shared/sms/factory/sms.factory';
import { SmsService } from '../../../shared/sms/sms.service';
import { DonorService } from '../../donor/service/donor.service';
import { DonorStatusService } from '../../donor_status/service/donor_status.service';
import { BloodRequestRepository } from '../repository/blood_request.repository';
import { BloodRequestFilterResponse, NewDonorStatus } from '../_dto/blood_request.dto';

export interface IBloodRequestService{
    createBloodRequest(payload: any): Promise<any>
    viewAllBloodRequests(): Promise<any>
    viewBloodRequestById(id : number): Promise<any>
    editBloodRequestById(id: number, payload: any): Promise<any>
    deleteBloodRequestById(id : number): Promise<any>
}
@injectable()
export class BloodRequestService implements IBloodRequestService {
	constructor(
        @inject(BloodRequestRepository) private readonly bloodRequestRepo: BloodRequestRepository,
        @inject(TYPES.SmsService) private readonly smsService: SmsService,
        @inject(TYPES.DonorStatusService) private readonly donorStatusService: DonorStatusService,
        @inject(TYPES.DonorService) private readonly donorService: DonorService,
	) {}

	// create blood request
	async createBloodRequest(payload: any) {
		/// Need to check or limit request for blood requester??
		const otp = randomSixDigitOtp();
		const otpHash = hashSync(otp.toString(), 12);

		payload.otp = otpHash;
		payload.created_at = new Date();
		const createBloodRequest = await this.bloodRequestRepo.createBloodRequest(payload);

		/// Nearby donors
		let availableDonors: BloodRequestFilterResponse[] | any = [];
		console.log(createBloodRequest.pin, createBloodRequest.blood_group);
		availableDonors = await this.filter_blood_request(createBloodRequest.pin, createBloodRequest.blood_group);
		if (availableDonors.length === 0) {
			availableDonors = await this.donorService.viewDonors();
		}

		const donorStatus: NewDonorStatus[] = [];
		availableDonors.map((donor) => (
			donorStatus.push({
				donor_id: donor.id,
				user_id: donor.userId,
				blood_request_id: createBloodRequest.id,
				status: 'REQUESTED',
				created_at: new Date(),
			})
		));

		
		// save donor request status
		await this.donorStatusService.saveDonorStatus(donorStatus);

		///Process Push Notification after response is written
		this.triggerPushNotification(availableDonors, createBloodRequest.id);

		/// Send OTP to user mobile
		await this.smsService.send({
			otp,
			type: SmsTypes.requesterOtp,
			phone: createBloodRequest.mobile_number,
		});


		return { ...createBloodRequest, otp };
	}

	// viewAllBloodRequest
	async viewAllBloodRequests() {
		const bloodRequest = await this.bloodRequestRepo.find_all_blood_request();
		return bloodRequest;
	}

	// view blood request by id
	async viewBloodRequestById(id: number) {
		const bloodRequest = await this.bloodRequestRepo.find_blood_request_by_id(id);
		return bloodRequest;
	}

	// edit blood request by id
	async editBloodRequestById(id: number, payload: any) {
		const bloodRequest = await this.bloodRequestRepo.update_blood_request_by_id(id, payload);
		return bloodRequest;
	}

	// delete blood request by id
	async deleteBloodRequestById(id: number) {
		const bloodRequest = await this.bloodRequestRepo.delete_blood_request_by_id(id);
		return bloodRequest;
	}

	// filtering donor for requested blood request
	async filter_blood_request(pin: number, blood_group: string): Promise<BloodRequestFilterResponse[]> {
		let donorDetails: BloodRequestFilterResponse[] = [];
		///get Blood Group
		const getSuitableBloodGroup = await this.bloodRequestRepo.get_matching_blood_request(blood_group);
		donorDetails = await this.bloodRequestRepo.filter_blood_request_by_blood_group(getSuitableBloodGroup, pin);
		return donorDetails;
	}

	///Check if donor eligible for donation
	async find_donor_notification_eligibility(donorId: number) {
		///Find Donor
		const donor = await this.donorService.viewDonor(donorId);
		if (!donor) return null;

		///Find Last Donation
		const latestDonations: any[] = await this.donorStatusService.view_blood_request_by_action(donor.userId, 'DONATION_COMPLETE');
		if (latestDonations.length === 0) return true;

		const latestDonation = latestDonations.reverse()[0];

		//Donor Frequency
		const preferred_frequency: number = parseInt(donor.preferred_frequency);

		const currentDate = new Date();
		const last_donation_date = new Date(latestDonation.completed_date);
		
		const diff = currentDate.getTime() - last_donation_date.getTime();
		const diffInMonths: number = Math.round(diff / 2629746000);

		return diffInMonths >= preferred_frequency ? true : false;
	}

	private async triggerPushNotification(donors: any[], bloodRequestId: number) {
		if (donors.length === 0) return;
		
		for (const donor of donors) {
			const isDonorEligible = await this.find_donor_notification_eligibility(donor.id);
			console.log(donor.id, isDonorEligible, 'Notification Eligibility');
			if (!isDonorEligible) continue;

			const tokens: PushToken[] = await this.donorService.get_donor_expo_push_tokens_by_id(donor.userId);
			if (tokens?.length > 0) sendPushNotification(
				tokens,
				{
					type: 'incoming_blood_request',
					id: bloodRequestId
				},
				'You have a new Blood Request'
			);
		}
	}
	
}

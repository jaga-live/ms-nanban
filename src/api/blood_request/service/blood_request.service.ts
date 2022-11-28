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
    editBloodRequestById(id: number): Promise<any>
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
		const createBloodRequest = await this.bloodRequestRepo.createBloodRequest(payload);

		/// Nearby donors
		let availableDonors: BloodRequestFilterResponse[] | any = [];
		availableDonors = await this.filter_blood_request(createBloodRequest.pin, createBloodRequest.blood_group);
		if (availableDonors.length === 0) {
			availableDonors = await this.donorService.viewDonors();
		}

		const donorStatus: NewDonorStatus[] = [];
		availableDonors.map((donor) => (
			donorStatus.push({
				donor_id: donor.id,
				blood_request_id: createBloodRequest.id,
				is_accepted: 'REQUESTED',
				created_at: new Date(),
			})
		));

		// save donor request status
		await this.donorStatusService.saveDonorStatus(donorStatus);

		// Send push notification for donor
		availableDonors.map(async (donor) => {
			const tokens: PushToken[] = await this.donorService.get_donor_expo_push_tokens_by_id(donor.id);
			if (tokens?.length > 0) sendPushNotification(tokens, 'Blood requested');
		});

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
	async editBloodRequestById(id: number) {
		const bloodRequest = await this.bloodRequestRepo.update_blood_request_by_id(id);
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
		const getSuitableBloodGroup = await this.bloodRequestRepo.get_matching_blood_request(blood_group);
		donorDetails = await this.bloodRequestRepo.filter_blood_request_by_blood_group(getSuitableBloodGroup, pin);
		return donorDetails;
	}
}

import { inject, injectable } from 'inversify';
import { HttpException } from '../../../core/exception';
import { container } from '../../../core/inversify/inversify.config';
import { TYPES } from '../../../core/inversify/types';
import { generateCertificate } from '../../../helper/html-to-pdf-buffer';
import { MailDto } from '../../../shared/mail/mail.dto';
import { IMailService, MailService } from '../../../shared/mail/mail.service';
import { Donor } from '../../donor/model/donor.model';
import { DonorRepository } from '../../donor/repository/donor.repository';
import { DonorStatusRepository } from '../repository/donor_status.repository';

export interface IDonorStatusService{
    saveDonorStatus(payload: any): Promise<any>
    viewAllDonorStatus(): Promise<any>
    viewDonorStatusById(id : number): Promise<any>
    viewDonorStatusByDonorId(donor_id: number): Promise<any>
    deleteDonoeStatusById(id : number): Promise<any>
}

// attachments
export interface Attachments {
    path: string;
}

@injectable()
export class DonorStatusService implements IDonorStatusService {
	constructor(
        @inject(DonorStatusRepository) private readonly donorStatusRepo: DonorStatusRepository,
        @inject(DonorRepository) private readonly donorRepo: DonorRepository,
        @inject(TYPES.MailService) private readonly mailService: MailService,
	) {}

	// save donorstatus
	async saveDonorStatus(payload: any) {
		const saveDonorStatus = await this.donorStatusRepo.saveDonorStatus(payload);
		return saveDonorStatus;
	}

	// view all donor status
	async viewAllDonorStatus() {
		const viewAllDonorStatus = await this.donorStatusRepo.find_all_donor_status();
		return viewAllDonorStatus;
	}

	// view donor status by id
	async viewDonorStatusById(id : number) {
		const viewDonorStatusById = await this.donorStatusRepo.find_donor_status_by_id(id);
		return viewDonorStatusById;
	}

	// view donor status by donor id
	async viewDonorStatusByDonorId(donor_id: number) {
		const viewDonorStatusByDonorId = await this.donorStatusRepo.find_donor_status_by_donor_id(donor_id);
		return viewDonorStatusByDonorId;
	}

	// delete donor status by id
	async deleteDonoeStatusById(id) {
		const deleteDonorStatusById = await this.donorStatusRepo.delete_donor_status_by_donor_id(id);
		return deleteDonorStatusById;
	}

	// accept or reject blood request
	async accept_or_reject_blood_request(blood_request_id: number, donor_id: number, status: boolean): Promise<any> {
		const donor = await this.donorRepo.find_donor_by_id(donor_id);
		if (!donor) throw new HttpException('Donor Id not found', 400);

		const bloodReq = await this.donorStatusRepo.find_donor_status_by_blood_request_id(blood_request_id);
		if (!bloodReq) throw new HttpException('Blood Request not found', 400);

		return this.donorStatusRepo.accept_or_reject_blood_request(blood_request_id, donor_id, status);
	}

	// confirm otp and complete workflow
	async confirm_otp(blood_request_id: number, donor_id: number, otp: string): Promise<any> {
		const donor: Donor = await this.donorRepo.find_donor_by_id(donor_id);
		if (!donor) throw new HttpException('Donor Id not found', 400);

		const bloodReq = await this.donorStatusRepo.find_donor_status_by_blood_request_id(blood_request_id);
		if (!bloodReq) throw new HttpException('Blood Request not found', 400);

		await this.donorStatusRepo.confirm_otp(blood_request_id, donor_id, otp);

		// certificate details
		const certificateDetails = await this.donorStatusRepo.get_certificate_details_by_blood_req_id(blood_request_id);

		certificateDetails[0].completed_date = certificateDetails[0].completed_date.toISOString().split('T')[0];

		// generate certificate and send mail
		const attachments: Attachments[] = [];
		const certificate: string = await generateCertificate(certificateDetails[0]);
		attachments.push({
			path: `data:application/pdf;base64,${certificate}`,
		});

		const config = {
			to: donor.email,
			type: 'send_certificate',
			attachments,
		};
		this.mailService.sendMail(config);

		return {
			message: 'workflow completed',
		};
	}

	async get_blood_request_list(donor_id: number) {
		const donor = await this.donorStatusRepo.getDonorBloodRequsetList(donor_id);
		if (!donor) throw new HttpException('Donor Id not found', 400);

		return donor;
	}
}

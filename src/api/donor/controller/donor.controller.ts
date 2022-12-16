import { Request } from 'express';
import { inject } from 'inversify';
import {
	controller, httpGet, httpPatch, httpPost, request, requestParam,
} from 'inversify-express-utils';
import { Req } from '../../../core/custom.types';
import { TYPES } from '../../../core/inversify/types';
import { upload } from '../../../helper/multer';
import { RolesGuard } from '../../auth/middleware/roles.middleware';
import { DonorStatusService } from '../../donor_status/service/donor_status.service';
import { ROLES } from '../../users/enum/roles.user';
import { DonorService } from '../service/donor.service';
import { ConfirmOTPDTO, CreateDonorDto, UpdateStatusDTO } from '../_dto/donor.dto';

@controller('/donor')

export class DonorController {
	constructor(
        @inject(TYPES.DonorService) private readonly donorService: DonorService,
        @inject(TYPES.DonorStatusService) private readonly donorStatusService: DonorStatusService,
	) { }

    /// Donor Registration
    @httpPost(
    	'/register',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.DONOR]),
    )
	async donorRegistration(req: Req) {
		const { userId } = req.userData;

		const payload = await CreateDonorDto.validate(req.body);
		return this.donorService.createDonor(userId, payload);
	}

    /// Edit Donor
    @httpPatch('', upload.single('image'))
    async editDonor(req: Req) {
    	console.log(req.file);
    	return 'Hello';
    }

    // confirm otp and complete flow
    @httpPost(
    	'/blood_request/flow/complete',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.DONOR]),
    )
    async confirm_otp(req: Req): Promise<any> {
    	const { userId } = req.userData;
		console.log(req.body)
    	const payload: ConfirmOTPDTO = await ConfirmOTPDTO.validate(req.body);
    	return this.donorStatusService.confirm_otp(payload.blood_req_id, userId, payload.otp);
    }
	

	////List Blood Request based on Status
	@httpGet(
		'/blood_request/:status',
	    TYPES.AuthGuard,
		RolesGuard([ROLES.DONOR])
	)
    async view_blood_request(
		@request() req: Req,
		@requestParam('status') status: string
    ) {
    	const { userId } = req.userData;
    	return this.donorStatusService.view_blood_request_by_action(userId, status);
    }


	////Update Blood Request Status
	@httpPatch(
		'/blood_request/status/:status',
		TYPES.AuthGuard,
		RolesGuard([ROLES.DONOR])
	)
	async update_bloodRequest_status(
		@request() req: Req,
		@requestParam('status') status: string
	) {
		const { userId } = req.userData;
		await this.donorStatusService.update_donor_status(userId, req.body.blood_request_id, status);
		return {
			message: 'Status Updated'
		};
		
	}

}

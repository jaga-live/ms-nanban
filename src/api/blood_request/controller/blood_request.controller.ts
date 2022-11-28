import { Request } from 'express';
import { inject } from 'inversify';
import {
	controller, httpGet, httpPost, params, requestParam,
} from 'inversify-express-utils';
import { Req } from '../../../core/custom.types';
import { TYPES } from '../../../core/inversify/types';
import { BloodRequestService } from '../service/blood_request.service';
import { BloodRequestDto } from '../_dto/blood_request.dto';

@controller('/blood')
export class BloodRequestController {
	constructor(
        @inject(TYPES.BloodRequestService) private readonly bloodRequestService : BloodRequestService,
	) {}

    /// Request blood
    @httpPost('/request')
	async requestBlood(req: Req) {
		const payload = await BloodRequestDto.validate(req.body);
		return this.bloodRequestService.createBloodRequest(payload);
	}

    @httpGet('/request')
    async viewBloodRequest() {
    	return this.bloodRequestService.viewAllBloodRequests();
    }

    /// Find blood request by id
    @httpGet('/request/:requestId')
    async viewSingleBloodRequest(
        @requestParam('requestId') requestId: number,
    ) {
    	return this.bloodRequestService.viewBloodRequestById(requestId);
    }
}

import { inject } from 'inversify';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
import { TYPES } from '../../../core/inversify/types';
import { RolesGuard } from '../../auth/middleware/roles.middleware';
import { ROLES } from '../../users/enum/roles.user';
import { DonorStatusService } from '../service/donor_status.service';
import { Req } from '../../../core/custom.types';

@controller('/donor')
export class DonorStatusController {
	constructor(
        @inject(TYPES.DonorStatusService) private readonly donorStatusService : DonorStatusService,
	) {}

    @httpGet(
    	'/blood_request',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.DONOR]),
    )
	async getBloodRequestList(req:Req) {
		const { userId } = req.userData;
		return this.donorStatusService.get_blood_request_list(userId);
	}
}

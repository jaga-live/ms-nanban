import { inject } from 'inversify';
import {
	controller, httpGet, httpPatch, httpPost,
} from 'inversify-express-utils';
import { Req } from '../../../core/custom.types';
import { TYPES } from '../../../core/inversify/types';
import { RolesGuard } from '../../auth/middleware/roles.middleware';
import { ROLES } from '../../users/enum/roles.user';
import { BloodService } from '../service/blood.service';
import { BloodDto } from '../_dto/blood.dto';

@controller('/blood')
export class BloodController {
	constructor(
        @inject(TYPES.BloodService) private readonly BloodService : BloodService,
	) {}

    @httpPatch(
    	'/mapping_blood_type',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.ADMIN]),
    )
	async mapBlood(req : Req) {
		const payload = await BloodDto.validation(req.body);
		return this.BloodService.saveBloodGroupMapping(payload.blood_mapping);
	}

     @httpGet(
     	'/mapping_blood_type',
     	TYPES.AuthGuard,
     	RolesGuard([ROLES.ADMIN]),
     )
    async getBloodGroupList() {
    	return this.BloodService.getMappedBloodGroups();
    }
}

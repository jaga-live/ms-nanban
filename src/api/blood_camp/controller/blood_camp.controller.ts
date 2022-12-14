import { Request } from 'express';
import { inject } from 'inversify';
import {
	controller, httpDelete, httpGet, httpPatch, httpPost, requestBody, requestParam,
} from 'inversify-express-utils';
import { Req } from '../../../core/custom.types';
import { TYPES } from '../../../core/inversify/types';
import { RolesGuard } from '../../auth/middleware/roles.middleware';
import { ROLES } from '../../users/enum/roles.user';
import { IBloodCampService } from '../service/blood_camp.service';
import { CreateBloodCampDto, EditBloodCampDto } from '../_dto/blood_camp.dto';

@controller('/blood_donation_camp')
export class BloodCampController {
	constructor(
        @inject(TYPES.BloodCampService) private readonly bloodCampService: IBloodCampService,
	) { }

    ///Public BloodCamp Register
    @httpPost('/register')
	async registerBloodCamp(req: Request) {
		const payload = await CreateBloodCampDto.validate(req.body);
		return this.bloodCampService.register_bloodCamp(payload);
	}

    /// Add Multiple BloodCamp
    @httpPost(
    	'/bulk',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.ADMIN]),
    )
    async addMultipleBloodCamp(
    	req: Request,
    ) {
    	const { data } = req.body;
    	for (let index = 0; index < data.length; index++) {
    		const payload = await CreateBloodCampDto.validate(data[index]);
    		await this.bloodCampService.create_multiple_bloodCamp(payload);
    	}

    	return {
    		message: 'Bulk Upload Successful',
    	};
    }

    /// View all BloodCamp
    @httpGet('')
    async viewAllBloodCamps() {
    	return this.bloodCampService.view_all_bloodCamp();
    }

    /// View Single BloodCamp
    @httpGet('/:bloodCampId')
    async viewSingle(
        @requestParam('bloodCampId') id: number,
    ) {
    	return this.bloodCampService.view_single_bloodCamp(id);
    }
    /// View Single BloodCamp
    @httpGet(
    	'/status/:status',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.ADMIN])
    )
    async viewByStatus(
        @requestParam('status') status: string,
    ) {
    	return this.bloodCampService.view_bloodCamp_by_status(status);
    }

    /// Edit BloodCamp
    @httpPatch('/:bloodCampId',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.ADMIN]))
    async editBloodCamp(
        @requestParam('bloodCampId') id: number,
        @requestBody() payload: EditBloodCampDto,
    ) {
    	payload = await EditBloodCampDto.validate(payload);
    	return this.bloodCampService.edit_single_bloodCamp(id, payload);
    }

    /// Delete Single BloodCamp
    @httpDelete('/:bloodCampId')
    async deleteSingle(
        @requestParam('bloodCampId') id: number,
    ) {
    	await this.bloodCampService.delete_bloodCamp(id);
    	return {
    		message: 'BloodCamp Deleted',
    	};
    }
}

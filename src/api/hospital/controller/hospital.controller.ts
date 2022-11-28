import { Request } from 'express';
import { inject } from 'inversify';
import {
	controller, httpDelete, httpGet, httpPatch, httpPost, requestBody, requestParam,
} from 'inversify-express-utils';
import { Req } from '../../../core/custom.types';
import { TYPES } from '../../../core/inversify/types';
import { RolesGuard } from '../../auth/middleware/roles.middleware';
import { ROLES } from '../../users/enum/roles.user';
import { IHospitalService } from '../service/hospital.service';
import { CreateHospitalDto, EditHospitalDto } from '../_dto/hospital.dto';

@controller('/hospital')
export class HospitalController {
	constructor(
        @inject(TYPES.HospitalService) private readonly hospitalService: IHospitalService,
	) { }

    /// Add Single Hospital
    @httpPost(
    	'',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.ADMIN]),
    )
	async addHospital(
		req: Request,
	) {
		const payload = await CreateHospitalDto.validate(req.body);
		return this.hospitalService.create_hospital(payload);
	}

    /// Add Multiple Hospital
    @httpPost(
    	'/bulk',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.ADMIN]),
    )
    async addMultipleHospital(
    	req: Request,
    ) {
    	const { data } = req.body;
    	for (let index = 0; index < data.length; index++) {
    		const payload = await CreateHospitalDto.validate(data[index]);
    		await this.hospitalService.create_multiple_hospital(payload);
    	}

    	return {
    		message: 'Bulk Upload Successful',
    	};
    }

    /// View all Hospital
    @httpGet('')
    async viewAllHospitals() {
    	return this.hospitalService.view_all_hospital();
    }

    /// View Single Hospital
    @httpGet('/:hospitalId')
    async viewSingle(
        @requestParam('hospitalId') id: number,
    ) {
    	return this.hospitalService.view_single_hospital(id);
    }

    /// Edit Hospital
    @httpPatch('/:hospitalId')
    async editHospital(
        @requestParam('hospitalId') id: number,
        @requestBody() payload: EditHospitalDto,
    ) {
    	payload = await EditHospitalDto.validate(payload);
    	return this.hospitalService.edit_single_hospital(id, payload);
    }

    /// Delete Single Hospital
    @httpDelete('/:hospitalId')
    async deleteSingle(
        @requestParam('hospitalId') id: number,
    ) {
    	await this.hospitalService.delete_hospital(id);
    	return {
    		message: 'Hospital Deleted',
    	};
    }
}

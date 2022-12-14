import { Request } from 'express';
import { inject } from 'inversify';
import {
	controller, httpDelete, httpGet, httpPatch, httpPost, requestBody, requestParam,
} from 'inversify-express-utils';
import { Req } from '../../../core/custom.types';
import { TYPES } from '../../../core/inversify/types';
import { AuthGuard } from '../../auth/middleware/auth.middleware';
import { RolesGuard } from '../../auth/middleware/roles.middleware';
import { ROLES } from '../../users/enum/roles.user';
import { IBloodBankService } from '../service/blood_bank.service';
import { CreateBloodBankDto, EditBloodBankDto } from '../_dto/blood_bank.dto';

@controller('/blood_bank')
export class BloodBankController {
	constructor(
        @inject(TYPES.BloodBankService) private readonly bloodBankService: IBloodBankService,
	) { }

    ///Public BloodBank Register
    @httpPost('/register')
	async registerBloodBank(req: Request) {
		const payload = await CreateBloodBankDto.validate(req.body);
		return this.bloodBankService.register_bloodBank(payload);
	}

    /// Add Multiple BloodBank
    @httpPost(
    	'/bulk',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.ADMIN]),
    )
    async addMultipleBloodBank(
    	req: Request,
    ) {
    	const { data } = req.body;
    	for (let index = 0; index < data.length; index++) {
    		const payload = await CreateBloodBankDto.validate(data[index]);
    		await this.bloodBankService.create_multiple_bloodBank(payload);
    	}

    	return {
    		message: 'Bulk Upload Successful',
    	};
    }

    /// View all BloodBank
    @httpGet('')
    async viewAllBloodBanks() {
    	return this.bloodBankService.view_all_bloodBank();
    }

    /// View Single BloodBank
    @httpGet('/:bloodBankId')
    async viewSingle(
        @requestParam('bloodBankId') id: number,
    ) {
    	return this.bloodBankService.view_single_bloodBank(id);
    }

    /// View Blood Bank by Status
    @httpGet(
    	'/status/:status',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.ADMIN]))
    async viewByStatus(
        @requestParam('status') status: string,
    ) {
    	return this.bloodBankService.view_bloodBank_by_status(status);
    }

    /// Edit BloodBank
    @httpPatch('/:bloodBankId',
    	TYPES.AuthGuard,
    	RolesGuard([ROLES.ADMIN])
    )
    async editBloodBank(
        @requestParam('bloodBankId') id: number,
        @requestBody() payload: EditBloodBankDto,
    ) {
    	payload = await EditBloodBankDto.validate(payload);
    	return this.bloodBankService.edit_single_bloodBank(id, payload);
    }

    /// Delete Single BloodBank
    @httpDelete('/:bloodBankId')
    async deleteSingle(
        @requestParam('bloodBankId') id: number,
    ) {
    	await this.bloodBankService.delete_bloodBank(id);
    	return {
    		message: 'BloodBank Deleted',
    	};
    }
}

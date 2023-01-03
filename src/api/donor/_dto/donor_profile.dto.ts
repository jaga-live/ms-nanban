export class DonorProfile{
	constructor(
        public id: number,
        public name: string,
        public email: string,
        public role: string,
        public donor_registered: boolean,
        public eligible_for_donation: boolean,
	){}
}
export const userFixture = [
	{
		name: 'dummy',
		email: 'dumy@mailinator.com',
		role: 'user',
		id: 1,
		donor_registered: true,
	},
];

export const createUserFixture = {
	body: {
		name: 'dummy',
		email: 'dummy@mailinator.com',
		role: 'user',
	},

	userData: {
		userId: '1',
	},
};

export const updateUserFixture = {
	body: {
		name: 'dummy',
		id: 1,
		donor_registered: true,
	},

};

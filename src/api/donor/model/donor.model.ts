import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Donor {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	full_name: string;

    @Column()
    	gender: string;

    @Column()
    	date_of_birth: string;

    @Column()
    	blood_group: string;

    @Column()
    	address_line_1: string;

    @Column()
    	address_line_2: string;

    @Column()
    	pin: number;

    @Column({ type: 'bigint' })
    	mobile_number: number;

    @Column()
    	email: string;

    @Column()
    	last_date_of_donation: string;

    @Column()
    	preferred_frequency: string;

    @Column({ unique: true })
    	userId: number;
}

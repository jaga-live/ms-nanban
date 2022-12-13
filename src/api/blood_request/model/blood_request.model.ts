import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BloodRequest {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	blood_group: string;

    @Column()
    	required_units: number;

    @Column()
    	type_of_request: string;

    @Column()
    	requester_name: string;

    @Column()
    	gender: string;

    @Column({ type: 'bigint' })
    	mobile_number: number;

    @Column()
    	hospital_name: string;

    @Column()
    	place: string;

    @Column()
    	address_line_1: string;

    @Column()
    	address_line_2: string;

    @Column()
    	state: string;

    @Column()
    	city: string;

    @Column()
    	pin: number;

    @Column()
    	otp: string;
    @Column()
    	created_at: Date;
        
}

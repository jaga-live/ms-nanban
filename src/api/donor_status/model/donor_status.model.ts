import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DonorStatus {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	donor_id : number;

    @Column()
    	is_accepted: string;

    @Column()
    	blood_request_id: number;

    @Column()
    	created_at : Date;

    @Column({ nullable: true })
    	otp_verified: boolean;

    @Column({ nullable: true })
    	completed_date: Date;
}

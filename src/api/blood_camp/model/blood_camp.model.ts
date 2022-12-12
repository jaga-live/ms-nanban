import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BloodCamp {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	camp_name : string;

    @Column()
    	event_address: string;
    
    @Column({ type: 'bigint' })
    	mobile_number : number;
    
    @Column()
    	approvalStatus : string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BloodBank {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	blood_bank_name : string;

    @Column()
    	address_line_1 : string;
    @Column()
    	address_line_2
 : string;
    @Column()
    	city : string;
    @Column()
    	state : string;
    @Column()
    	pin: number;
    
    @Column()
    	approvalStatus : string;
}

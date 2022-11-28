import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class Hospital {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	hospital_name: string;

    @Column()
    	address_line_1: string;

    @Column()
    	address_line_2: string;

    @Column()
    	pin: number;

    @Column()
    	state: string;

    @Column()
    	city: string;

    @Column({ default: v4() })
    	qrId: string;
}

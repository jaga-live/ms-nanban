import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blood {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	blood_group : string;

    @Column()
    	matching_blood_group : string;
}

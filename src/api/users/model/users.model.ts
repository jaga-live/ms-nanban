import {
	Column, Entity, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Auth } from '../../auth/model/auth.model';

export interface IUser{
    id: number
    name: string
    email: string
    role: string
    donor_registered: boolean
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	name: string;

    @Column({ unique: true })
    	email: string;

    @OneToOne(() => Auth, (auth) => auth.user)
    	auth: Auth;

    @Column()
    	role: string;

    @Column()
    	donor_registered: boolean;
}

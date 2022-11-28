import {
	Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/model/users.model';

/// Auth Entity
@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column({ nullable: true })
    	password: string;

    @Column({ nullable: true, default: null })
    	otp: string;

    @Column({ nullable: true, default: null })
    	signature: string;

    @Column({ nullable: true })
    	userId: number;

    @OneToOne(() => User, (user) => user.auth)
    @JoinColumn()
    	user: User;
}

// JWT Session
@Entity()
export class AuthSession {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	authId: number;

    @Column()
    	userId: number;

    @Column()
    	session: string;
}

// push token
@Entity()
export class ExpoPushToken {
    @PrimaryGeneratedColumn()
    	id: number;

    @Column()
    	userId: number;

    @Column({ nullable: true })
    	expo_push_token: string;
}

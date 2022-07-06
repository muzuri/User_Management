import { Exclude } from "class-transformer";
import { Column, Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column({unique: true})
    email: string

    @Column()
    gender: string

    @Column()
    age: number

    @Column({nullable: true})
    martalStatus: string

    @Column({nullable: true})
    emailToken: string

    @Column({nullable: true})
    isEmailValid: boolean

    @Column({default: 'user'})
    roles: string;

    @Column()
    nationality: string

    @Column({nullable: true})
    nationalIdNumber: string

    @Column({nullable: true})
    profile_image: string

    @Column({nullable: true})
    doc_image: string
    
    @Column({nullable: true})
    passwordToken: string

    @Column({default:'PENDING_VERIFICATION'})
    accountStatus: string

    @Column({nullable: true})
    documentType: string

    @Column()
    isAccountVerified: boolean
  
    @Column()
    birthDate: Date
    // @Column()
    // timestamp: Date


    @Column()
    @Exclude()
    password: string

}
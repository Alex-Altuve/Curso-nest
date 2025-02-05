import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{unique: true})
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool')
    isActivo: boolean;

    @Column('text', {array: true, default: ['user']})
    // @Column({
    //     type: 'enum',
    //     enum: Role,
    //     default: Role.USER, // Valor por defecto
    // })
    roles: string[];

}

import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{unique: true})
    email: string;

    /// * * esto del select es que si haces un select con el FindOneBy y no quieres que te regrese la contraseña
    @Column('text', {select : false})
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool',{default: true})
    isActive: boolean;

    @Column('text', {array: true, default: ['user']})
    // @Column({
    //     type: 'enum',
    //     enum: Role,
    //     default: Role.USER, // Valor por defecto
    // })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product[];

    
    @BeforeInsert()
    checkFiledsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFiledsBeforeUpdate(){
        this.checkFiledsBeforeInsert();
    }
}

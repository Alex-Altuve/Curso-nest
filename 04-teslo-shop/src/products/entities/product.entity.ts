import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity({'name': 'products'})
export class Product {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true
    })
    title: string;

    @Column('float', {default: 0})
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text',{unique: true})
    slug: string;

    @Column('int',{default: 0})
    stock: number;

    @Column('text', {array: true})
    sizes: string[];

    @Column('text')
    gender:string;
    
    //tags
    @Column('text', {
        array: true,
        default: [],
        nullable: true
    })
    tags: string[];

    //images, esto es una relacion no una columna
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true, eager: true} //cascade: true means that when we save a product, it will also save the product image
        // el eager funciona para que cuando hagamos un select de un producto nos traiga las imagenes (carge las relaciones)
    )
    images?: ProductImage[];

    @ManyToOne(
        ()=> User,
        (user) => user.product,
        {eager: true}
    )
    user: User;
    ///before insert
    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }

    ///before update
    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }


}

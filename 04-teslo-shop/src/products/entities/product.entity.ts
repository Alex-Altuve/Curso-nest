import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity()
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
    )
    images?: ProductImage[];


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

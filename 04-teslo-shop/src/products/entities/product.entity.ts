import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({'name': 'products'})
export class Product {
    
    @ApiProperty({ 
        example: '010afd0e-35cf-4701-b0ba-a1987ce7fe7e',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    
    @ApiProperty({ 
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    title: string;

    @ApiProperty({ 
        example: 0,
        description: 'Product Price',
    })
    @Column('float', {default: 0})
    price: number;

    @ApiProperty({ 
        example: 'Camisa de algodon',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;


    @ApiProperty({ 
        example: 't_shirt_teslo',
        description: 'Product Slug - for SEO ',
        uniqueItems: true
    })
    @Column('text',{unique: true})
    slug: string;

    @ApiProperty({ 
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int',{default: 0})
    stock: number;

    @ApiProperty({ 
        example: ['S','M','L','XL'],
        description: 'Product sizes',
    })
    @Column('text', {array: true})
    sizes: string[];

    @ApiProperty({ 
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender:string;
    
    @ApiProperty({ 
        example: ['shirt','t-shirt','clothes'],
        description: 'Product tags',
        default: 0
    })
    //tags
    @Column('text', {
        array: true,
        default: [],
        nullable: true
    })
    tags: string[];

    @ApiProperty()
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

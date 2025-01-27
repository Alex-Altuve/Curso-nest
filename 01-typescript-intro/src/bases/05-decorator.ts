class NewPoken{
    constructor(
        public readonly id: number,
        public name: string
    ){}

    public scream(){
        console.log(`NO QUIERO!!`);
    }

    public speak(){
        console.log(`NO QUIERO HABLAR!!`);
    }
}


const MyDecorator = () => {
    return (target: Function)=>{
        return NewPoken;
    }
}


@MyDecorator()
export class Pokemon{
    constructor(
        public readonly id: number,
        public name: string
    ){}

    public scream(){
        console.log(`${this.name.toUpperCase()}!!!`);
    }

    public speak(){
        console.log(`${this.name}, ${this.name}`);
    }
}

    export const charmander= new Pokemon(4, 'charmarder');

    charmander.scream();
    charmander.speak();
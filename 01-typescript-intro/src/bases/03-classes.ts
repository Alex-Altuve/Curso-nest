// export class Pokemon {
    
//     public name: string;
//     public id: number;

//     constructor(name: string, id: number){      
//         this.name = name;
//         this.id = id;
//     }
// }

import axios from 'axios';
import { Move, PokeApiResponse } from '../interface/pokeapi-response.interface';


export class Pokemon {
    constructor(
        public  name: string, 
        public readonly id: number
        //public ImageURL: string
    ){}

    get imageUrl(): string{
        return `https://pokemon.com/${this.id}.jpg`;
    }

    public setName(name: string) {
        this.name = name;
    }

    //metodos
    public scream(){
        console.log(`${this.name.toUpperCase()}!!!`);
    }

    public speak(){
        console.log(`Hola soy ${this.name}`);
    }

    async getMoves (): Promise<Move[]>{
        ///const moves = 10;

        // de esta forma da error por que no se ha definido el tipo de dato
        // const { data }= await axios.get('https://pokeapi.co/api/v2/pokemon/4');
        // if(data){
        //     const { moves } = data;
        //     moves.forEach(({ move: { name, url} }) => {
        //         console.log(`Move: ${name}, url: ${url}`);
        //     });
        // }

        //esto es la forma correcta de hacerlo
        // const { data } = await axios.get<{ moves: { move: { name: string; url: string } }[] }>('https://pokeapi.co/api/v2/pokemon/4');
        // data.moves.forEach(({ move: { name, url } }) => {
        //     console.log(`Move: ${name}, url: ${url}`);
        // });

        //************************************************* */
        const { data }= await axios.get<PokeApiResponse>('https://pokeapi.co/api/v2/pokemon/4');
        console.log(data.moves);
        return data.moves;
    }
}
/// metodos asincronos regresan una promesa
/// async getMoves -> await es para esperar el resultado (solo se puede usar si estas dentro de un metodo asincrono)
//axios ayuda con las peticiones http 
/// el readonly es para que no se pueda modificar el valor de la propiedad, es decir, que sea solo de lectura

export const charmander = new Pokemon('Chamander', 25);

// charmander.scream();
// charmander.speak();
charmander.getMoves();
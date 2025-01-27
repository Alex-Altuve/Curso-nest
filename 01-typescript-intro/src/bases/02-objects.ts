    export const pokemonIds = [1,2,3,45]

    // export const pokemon = {
    //     id: 1,
    //     name: 'Bulbasaur'
    // }

    interface Pokemon{
        id: number;
        name: string;
        age?: number; 
        //si le pongo un ? le digo que es opcional, es decir, que puede ser nulo o se pone | undefinied pero con este ultimo dices que debe ir en el onjeto
    }

    export const bulbasor: Pokemon = {
        id: 1,
        name: 'Bulbasaur',
    }

    export const pokemons: Pokemon[] = [];

    pokemons.push(bulbasor);

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';



import { PokeResponse } from 'src/interfaces/poke-response.interface';

///solucion de mi profesor
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';


import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { fecthAdapter } from 'src/common/adapters/fecth.adapter';


@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
     private readonly http:  AxiosAdapter  //se puede cambiar por fecthAdapter y funciona igual
     
  ) {}


  
  
  async exececuteSeed() {
    
    await this.pokemonModel.deleteMany();

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
   
    const pokemonToInsert: {name: string, no:number}[] = [];
    
    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];
      
      pokemonToInsert.push({name, no});

    });

    await this.pokemonModel.insertMany(pokemonToInsert); 
    // insert into pokemons (name,no)
    // (name: 'bulbasaur', no: 1)
    // (name: 'bulbasaur', no: 1)
    // (name: 'bulbasaur', no: 1)

    return 'Seed Executed';
  }
}

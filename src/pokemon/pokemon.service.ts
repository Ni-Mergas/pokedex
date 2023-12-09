import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>,
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
   
      return pokemon;
      
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }
  
  async findOne(term: string) {//el id viene en función de termino, ya que no es el id que proporciona mongo, es el id que le proporcionamos en no
    
    let pokemon : Pokemon;

    if(!isNaN(+term)){ // el condicional es la negación de la negación, es decir, esta preguntando si el id es un número, por eso se le pone el + antes del id, por que el id viene como string
      pokemon = await this.pokemonModel.findOne({ no:term })
    }

      //Verificación por Mongo ID, se realiza la validación mediante el isValidObjectId, se le prpoporciona el term, y se verifica que el id sea el que proporciona automaticamente mongo
    if( !pokemon && isValidObjectId( term ) ){
       pokemon = await this.pokemonModel.findById( term );
    }
      // Verificación por nombre
    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
   
     }

    if( !pokemon ) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);
  
  

  return pokemon;

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    //Para actualizar, primero se validan los campos que se van a actualizar, en este caso se valida los datos prevenientes en el term
    const pokemon = await this.findOne(term);

    
      // se hace una conversión del parametro ingresado si viene nombre, para que al momento de guardarlo pase a letra minuscula
      if( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      try {
      // Se guardan los cambios en la base de datos
      //const updatedPokemon = await pokemon.updateOne( updatePokemonDto, { new:true} ); 
      // Se guarda y retorna en updatedPokemon y se le proporciona al updatePokemonDto new:true para que se refleje la actualización inmediatamente al realizar el envio, de lo contrario, quedara los valores que ya estaban en la db
      //return updatedPokemon;
      // Si no funciona el metodo anterior para observar en tiempo real la actualización, se puede realizar lo siguiente
      await pokemon.updateOne(updatePokemonDto);
      return{... pokemon.toJSON(), ...updatePokemonDto};
      
    } catch (error) {
     this.handleExceptions(error);
    }
  }
  async remove(id: string) {
    //Para poder realizar la eliminación validamos que el id exista
    //const pokemon = await this.findOne(id);
    //await pokemon.deleteOne();
    //  return{ id };
    //const result = await this.pokemonModel.findByIdAndDelete( id ); se comenta esta línea para dejar como referencia el metodo de eliminar, pero en la siguiente, se proporciona uno mas optimo, en el cual se valida el mongoId y se elimina en una sola consulta 
    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id }); // Hay que tener cuidado con el deleteMany, por que se pueden eliminar todos los registros en este caso de la "tabla" pokemons
    if( deletedCount === 0)
    throw new BadRequestException(`Pokemon whit id "${id}" not found`)
    return ;
  }

  //Como se realiza repetidamente el manejo de este error, se puede crear un metodo privado en el que se le anexe un handleException, que se pueda reutilizar en el cath del create y el update
  private handleExceptions( error: any){
    if ( error.code === 11000){
      throw new BadRequestException(`Pokemon exist in Data base ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
      throw new InternalServerErrorException(`Can't create pokemon, check serverl logs`)

  }
}




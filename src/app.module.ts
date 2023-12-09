
import { join } from 'path';//Paquete proveniente de node
import { MongooseModule } from '@nestjs/mongoose';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),

    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest-pokemon'),//conexión a mongodb
    


    PokemonModule, CommonModule
  ],

})
export class AppModule {}

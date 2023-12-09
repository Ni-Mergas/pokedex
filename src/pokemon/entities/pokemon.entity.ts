import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {
    //@prop, es un decorador de nest que nos permite indicarle propiedades al eschema
    @Prop({ 
        unique:true,
        index:true,
    })
    name: string;

    @Prop({ 
        unique:true,
        index:true,
    })
    no:number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
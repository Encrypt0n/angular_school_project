import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@school-app/data';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Subject } from '../subject/subject.schema';
import { UserSchema } from '../user/user.schema';


export type EducationDocument = Education & Document;

@Schema()
export class Education {
    @Prop({ default: uuid, index: true })
    id: string;

    @Prop({
        required: true,
    })
    name: string;

    @Prop({
      required: true,
    })
    description: string;

   

   

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Subject' })
    subjects: Subject[];

    
    /*@Prop({type: [UserSchema]})
    students: User[];*/





    /*@Prop({ type: AddressSchema })
    address: Address;*/
}

export const EducationSchema = SchemaFactory.createForClass(Education);

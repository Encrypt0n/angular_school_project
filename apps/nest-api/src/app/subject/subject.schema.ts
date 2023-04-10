import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Education, User } from '@school-app/data';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { UserSchema } from '../user/user.schema';


export type SubjectDocument = Subject & Document;

@Schema()
export class Subject {
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

    @Prop({
        required: true,
        
    })
    credits: number;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Education' })
    educations: Education[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
    students: User[];

    /*@Prop({type: [UserSchema]})
    students: User[];*/





    /*@Prop({ type: AddressSchema })
    address: Address;*/
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SubjectSchema, Subject } from '../subject/subject.schema'
//import { Subject } from '@school-app/data';

//const Subject = require('../subject/subject.schema'); 


export type ResultDocument = Result & Document;

@Schema()
export class Result {
    @Prop({ default: uuid, index: true })
    id: string;

    @Prop({
        required: true,
      })
    studentId: string;

    


  

  

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, autopopulate: true })
    subject: Subject;


   

    
    

    @Prop({
        required: true,
        
    })
    grade: number;

    @Prop({
        required: true,
        
    })
    rating: string;





    /*@Prop({ type: AddressSchema })
    address: Address;*/
}

export const ResultSchema = SchemaFactory.createForClass(Result);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type AddressDocument = Address & Document;

@Schema()
export class Address {
    @Prop({ default: uuid, index: true })
    id: string;

    @Prop()
    city: string;

    @Prop()
    street: string;

    @Prop()
    postal_code: string;

    @Prop()
    country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
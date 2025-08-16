// src/users/entities/user.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ required: true, enum: ['buyer', 'seller', 'admin'] })
  role: string;

  @Prop()
  business_verification?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
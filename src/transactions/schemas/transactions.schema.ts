import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true })
  buyer_id: string;

  @Prop({ required: true })
  seller_id: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['pending', 'completed', 'disputed', 'cancelled'] })
  status: string;

  @Prop({ required: true })
  product: string;

  @Prop()
  escrow_id: string;

  @Prop()
  tracking_number: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
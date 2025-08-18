import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Escrow extends Document {
  @Prop({ required: true })
  transaction_id: string;

  @Prop({ required: true })
  hold_date: Date;

  @Prop()
  release_date: Date;

  @Prop({ required: true, enum: ['held', 'released', 'refunded'] })
  status: string;
}

export const EscrowSchema = SchemaFactory.createForClass(Escrow);
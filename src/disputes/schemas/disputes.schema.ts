import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Dispute extends Document {
  @Prop({ required: true })
  transaction_id: string;

  @Prop({ required: true })
  raised_by: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true, enum: ['pending', 'in_review', 'resolved', 'closed'] })
  status: string;

  @Prop()
  resolution: string;
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
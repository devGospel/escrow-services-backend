import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, ref: 'Product' })
  productId: string;

  @Prop({ required: true, ref: 'User' })
  buyerId: string;

  @Prop({ required: true, ref: 'User' })
  sellerId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, ref: 'Escrow' })
  escrowId: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  trackingNumber?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
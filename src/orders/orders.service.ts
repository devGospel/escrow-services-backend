import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const product = await this.productsService.findOne(createOrderDto.productId);
    if (createOrderDto.buyerId !== userId) {
      throw new UnauthorizedException('Only the buyer can create an order');
    }
    if (createOrderDto.quantity > product.stock) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }
    const amount = product.price * createOrderDto.quantity;
    const order = new this.orderModel({ ...createOrderDto, amount, sellerId: product.sellerId });
    await this.productsService.update(product.id, { stock: product.stock - createOrderDto.quantity }, product.sellerId);
    return order.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('productId').exec();
  }

  async findByBuyer(buyerId: string): Promise<Order[]> {
    return this.orderModel.find({ buyerId }).populate('productId').exec();
  }

  async findBySeller(sellerId: string): Promise<Order[]> {
    return this.orderModel.find({ sellerId }).populate('productId').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('productId').exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order as Order; // Type assertion to ensure Order type
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, userId: string): Promise<Order> {
    const order = await this.findOne(id); // Reuses findOne to ensure order exists
    if (order.sellerId !== userId) {
      throw new UnauthorizedException('Only the seller can update order status');
    }
    const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).populate('productId').exec();
    if (!updatedOrder) {
      throw new NotFoundException('Order not found after update');
    }
    return updatedOrder as Order; // Type assertion to ensure Order type
  }
}
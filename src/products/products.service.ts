import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
    if (createProductDto.sellerId !== userId) {
      throw new UnauthorizedException('Only the seller can create products');
    }
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findBySeller(sellerId: string): Promise<Product[]> {
    return this.productModel.find({ sellerId }).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product as Product; // Type assertion to ensure Product type
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string): Promise<Product> {
    const product = await this.findOne(id); // Reuses findOne to ensure product exists
    if (product.sellerId !== userId) {
      throw new UnauthorizedException('Only the product owner can update it');
    }
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    if (!updatedProduct) {
      throw new NotFoundException('Product not found after update');
    }
    return updatedProduct as Product; // Type assertion to ensure Product type
  }

  async remove(id: string, userId: string): Promise<void> {
    const product = await this.findOne(id); // Reuses findOne to ensure product exists
    if (product.sellerId !== userId) {
      throw new UnauthorizedException('Only the product owner can delete it');
    }
    await this.productModel.findByIdAndDelete(id).exec();
  }
}
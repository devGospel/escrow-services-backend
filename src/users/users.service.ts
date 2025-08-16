// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity'; // Import UserDocument
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {} // Use UserDocument

  async create(createUserDto: CreateUserDto): Promise<UserDocument> { // Return UserDocument
    const { email, phone, password, role } = createUserDto;
    
    const existingUser = await this.userModel.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password_hash: hashedPassword,
    });
    return user.save(); // user is a UserDocument, so save() is available
  }

  async findOne(id: string): Promise<UserDocument> { // Return UserDocument
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDocument> { // Return UserDocument
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> { // Return UserDocument
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return user.save(); // user is a UserDocument, so save() is available
  }
}
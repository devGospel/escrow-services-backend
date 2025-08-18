import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Escrow } from './schemas/escrow.schema';
import { CreateEscrowDto } from './dto/create.ecrow.dto';
import { UpdateEscrowDto } from './dto/update-transaction.dto';

@Injectable()
export class EscrowService {
  constructor(@InjectModel(Escrow.name) private escrowModel: Model<Escrow>) {}

  async create(createEscrowDto: CreateEscrowDto): Promise<Escrow> {
    const escrow = new this.escrowModel(createEscrowDto);
    return escrow.save();
  }

  async findByTransaction(transactionId: string): Promise<Escrow> {
    const escrow = await this.escrowModel.findOne({ transaction_id: transactionId }).exec();
    if (!escrow) {
      throw new NotFoundException('Escrow not found');
    }
    return escrow;
  }

  async update(id: string, updateEscrowDto: UpdateEscrowDto): Promise<Escrow> {
    const escrow = await this.escrowModel.findByIdAndUpdate(id, updateEscrowDto, { new: true }).exec();
    if (!escrow) {
      throw new NotFoundException('Escrow not found');
    }
    return escrow;
  }
}
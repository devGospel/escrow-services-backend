import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dispute } from './schemas/disputes.schema';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';

@Injectable()
export class DisputesService {
  constructor(@InjectModel(Dispute.name) private disputeModel: Model<Dispute>) {}

  async create(createDisputeDto: CreateDisputeDto): Promise<Dispute> {
    const dispute = new this.disputeModel(createDisputeDto);
    return dispute.save();
  }

  async findByTransaction(transactionId: string): Promise<Dispute[]> {
    return this.disputeModel.find({ transaction_id: transactionId }).exec();
  }

  async update(id: string, updateDisputeDto: UpdateDisputeDto): Promise<Dispute> {
    const dispute = await this.disputeModel.findByIdAndUpdate(id, updateDisputeDto, { new: true }).exec();
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }
    return dispute;
  }
}
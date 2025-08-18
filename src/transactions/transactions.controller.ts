import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update.transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new transaction', description: 'Initiates a new transaction for a purchase, linking buyer, seller, and escrow.' })
  @ApiBody({
    type: CreateTransactionDto,
    examples: {
      example1: {
        summary: 'Create Transaction Example',
        value: {
          buyer_id: 'user123',
          seller_id: 'seller456',
          amount: 5000,
          product: 'Smartphone',
          status: 'pending',
          escrow_id: 'escrow789',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    schema: {
      example: {
        id: 'tx789',
        buyer_id: 'user123',
        seller_id: 'seller456',
        amount: 5000,
        product: 'Smartphone',
        status: 'pending',
        escrow_id: 'escrow789',
        createdAt: '2025-08-18T14:08:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/:role')
  @ApiOperation({ summary: 'Get transactions for a user', description: 'Fetches all transactions for a buyer or seller based on their role.' })
  @ApiParam({ name: 'userId', description: 'User ID (buyer or seller)', example: 'user123' })
  @ApiParam({ name: 'role', description: 'User role (buyer or seller)', example: 'buyer' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    schema: {
      example: [
        {
          id: 'tx789',
          buyer_id: 'user123',
          seller_id: 'seller456',
          amount: 5000,
          product: 'Smartphone',
          status: 'pending',
          escrow_id: 'escrow789',
          createdAt: '2025-08-18T14:08:00.000Z',
        },
        {
          id: 'tx790',
          buyer_id: 'user123',
          seller_id: 'seller457',
          amount: 3000,
          product: 'Headphones',
          status: 'completed',
          escrow_id: 'escrow790',
          createdAt: '2025-08-17T10:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByUser(@Param('userId') userId: string, @Param('role') role: string) {
    return this.transactionsService.findByUser(userId, role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction status or details', description: 'Updates transaction status (e.g., dispatched) or adds tracking number.' })
  @ApiParam({ name: 'id', description: 'Transaction ID', example: 'tx789' })
  @ApiBody({
    type: UpdateTransactionDto,
    examples: {
      example1: {
        summary: 'Update Transaction Example',
        value: {
          status: 'dispatched',
          tracking_number: 'NG123456789',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
    schema: {
      example: {
        id: 'tx789',
        buyer_id: 'user123',
        seller_id: 'seller456',
        amount: 5000,
        product: 'Smartphone',
        status: 'dispatched',
        escrow_id: 'escrow789',
        tracking_number: 'NG123456789',
        updatedAt: '2025-08-18T14:10:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }
}
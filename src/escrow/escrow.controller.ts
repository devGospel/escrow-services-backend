import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { CreateEscrowDto } from './dto/create.ecrow.dto';
import { UpdateEscrowDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiBearerAuth,
  ApiSecurity 
} from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiTags('Escrow')
@ApiSecurity('JWT-auth')
@Controller('escrow')
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ 
    summary: 'Create a new escrow', 
    description: 'Holds funds for a transaction until conditions are met.' 
  })
  @ApiBody({
    type: CreateEscrowDto,
    examples: {
      example1: {
        summary: 'Create Escrow Example',
        value: {
          transaction_id: 'tx789',
          hold_date: '2025-08-18T14:08:00.000Z',
          status: 'held',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Escrow created successfully',
    schema: {
      example: {
        id: 'escrow789',
        transaction_id: 'tx789',
        hold_date: '2025-08-18T14:08:00.000Z',
        status: 'held',
        createdAt: '2025-08-18T14:08:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createEscrowDto: CreateEscrowDto) {
    return this.escrowService.create(createEscrowDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transaction/:transactionId')
  @ApiOperation({ 
    summary: 'Get escrow by transaction', 
    description: 'Retrieves escrow details for a specific transaction.' 
  })
  @ApiParam({ 
    name: 'transactionId', 
    description: 'Transaction ID', 
    example: 'tx789' 
  })
  @ApiResponse({
    status: 200,
    description: 'Escrow details',
    schema: {
      example: {
        id: 'escrow789',
        transaction_id: 'tx789',
        hold_date: '2025-08-18T14:08:00.000Z',
        status: 'held',
        createdAt: '2025-08-18T14:08:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Escrow not found' })
  findByTransaction(@Param('transactionId') transactionId: string) {
    return this.escrowService.findByTransaction(transactionId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update escrow status', 
    description: 'Updates escrow status (e.g., released or refunded) and release date.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Escrow ID', 
    example: 'escrow789' 
  })
  @ApiBody({
    type: UpdateEscrowDto,
    examples: {
      example1: {
        summary: 'Update Escrow Example',
        value: {
          status: 'released',
          release_date: '2025-08-18T14:15:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Escrow updated successfully',
    schema: {
      example: {
        id: 'escrow789',
        transaction_id: 'tx789',
        hold_date: '2025-08-18T14:08:00.000Z',
        release_date: '2025-08-18T14:15:00.000Z',
        status: 'released',
        updatedAt: '2025-08-18T14:15:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Escrow not found' })
  update(@Param('id') id: string, @Body() updateEscrowDto: UpdateEscrowDto) {
    return this.escrowService.update(id, updateEscrowDto);
  }
}
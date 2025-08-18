import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiBearerAuth,
  ApiSecurity,
  ApiHeader,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@ApiSecurity('JWT')
@ApiTags('Disputes')
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ 
    summary: 'Create a new dispute', 
    description: 'Initiates a dispute for a transaction with a reason. Requires authentication.' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiBody({
    type: CreateDisputeDto,
    examples: {
      buyerDispute: {
        summary: 'Buyer dispute example',
        value: {
          transaction_id: 'tx789',
          raised_by: 'user123',
          reason: 'Product not as described',
          status: 'pending',
        },
      },
      sellerDispute: {
        summary: 'Seller dispute example',
        value: {
          transaction_id: 'tx789',
          raised_by: 'seller456',
          reason: 'Buyer did not confirm receipt',
          status: 'pending',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Dispute created successfully',
    schema: {
      example: {
        id: 'dispute123',
        transaction_id: 'tx789',
        raised_by: 'user123',
        reason: 'Product not as described',
        status: 'pending',
        createdAt: '2025-08-18T14:08:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Only transaction participants can create disputes' 
  })
  create(@Body() createDisputeDto: CreateDisputeDto) {
    return this.disputesService.create(createDisputeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transaction/:transactionId')
  @ApiOperation({ 
    summary: 'Get disputes by transaction', 
    description: 'Retrieves all disputes associated with a transaction. Requires authentication.' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiParam({ 
    name: 'transactionId', 
    description: 'Transaction ID', 
    example: 'tx789',
    schema: {
      type: 'string',
      pattern: '^[a-zA-Z0-9]{5,20}$'
    }
  })
  @ApiResponse({
    status: 200,
    description: 'List of disputes',
    schema: {
      example: [
        {
          id: 'dispute123',
          transaction_id: 'tx789',
          raised_by: 'user123',
          reason: 'Product not as described',
          status: 'pending',
          createdAt: '2025-08-18T14:08:00.000Z',
        },
        {
          id: 'dispute124',
          transaction_id: 'tx789',
          raised_by: 'seller456',
          reason: 'Buyer did not confirm receipt',
          status: 'in_review',
          createdAt: '2025-08-18T14:09:00.000Z',
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Only transaction participants can view disputes' 
  })
  findByTransaction(@Param('transactionId') transactionId: string) {
    return this.disputesService.findByTransaction(transactionId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update dispute', 
    description: 'Updates dispute status (e.g., resolved) and adds resolution details. Requires admin privileges.' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Dispute ID', 
    example: 'dispute123',
    schema: {
      type: 'string',
      pattern: '^[a-zA-Z0-9]{5,20}$'
    }
  })
  @ApiBody({
    type: UpdateDisputeDto,
    examples: {
      adminResolution: {
        summary: 'Admin resolution example',
        value: {
          status: 'resolved',
          resolution: 'Refunded 50% to buyer',
          resolved_by: 'admin789'
        },
      },
      statusUpdate: {
        summary: 'Status update example',
        value: {
          status: 'in_review',
          reviewed_by: 'moderator123'
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Dispute updated successfully',
    schema: {
      example: {
        id: 'dispute123',
        transaction_id: 'tx789',
        raised_by: 'user123',
        reason: 'Product not as described',
        status: 'resolved',
        resolution: 'Refunded 50% to buyer',
        resolved_by: 'admin789',
        updatedAt: '2025-08-18T14:15:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Only admins/moderators can update disputes' 
  })
  @ApiNotFoundResponse({ 
    description: 'Not Found - Dispute not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Dispute not found'
      }
    }
  })
  update(@Param('id') id: string, @Body() updateDisputeDto: UpdateDisputeDto) {
    return this.disputesService.update(id, updateDisputeDto);
  }
}
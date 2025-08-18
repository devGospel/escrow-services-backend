import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Order } from './schemas/order.schema';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Create a new order', 
    description: 'Creates a new order for a product. Only buyers can create orders.' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      standardOrder: {
        summary: 'Standard order',
        value: {
          productId: '60d5ec49f1a2c12345678901',
          quantity: 2,
          escrowId: '60d5ec49f1a2c12345678902'
        }
      },
      bulkOrder: {
        summary: 'Bulk order',
        value: {
          productId: '60d5ec49f1a2c12345678901',
          quantity: 10,
          escrowId: '60d5ec49f1a2c12345678902'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
    schema: {
      example: {
        _id: '60d5ec49f1a2c12345678903',
        productId: {
          _id: '60d5ec49f1a2c12345678901',
          name: 'Laptop',
          price: 250000,
        },
        buyerId: 'user_id_from_jwt',
        sellerId: 'seller_id_from_product',
        amount: 500000,
        quantity: 2,
        escrowId: '60d5ec49f1a2c12345678902',
        status: 'pending',
        createdAt: '2025-08-18T15:34:00.000Z',
        updatedAt: '2025-08-18T15:34:00.000Z',
        __v: 0,
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Bad Request - Invalid input or insufficient stock',
    schema: {
      example: {
        statusCode: 400,
        message: 'Requested quantity exceeds available stock',
        error: 'Bad Request'
      }
    }
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
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Only buyers can create orders',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
  })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req): Promise<Order> {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all orders', 
    description: 'Retrieves all orders in the system. Accessible by admins.' 
  })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    type: [Order],
    schema: {
      example: [{
        _id: '60d5ec49f1a2c12345678903',
        productId: {
          _id: '60d5ec49f1a2c12345678901',
          name: 'Laptop',
          price: 250000,
        },
        buyerId: 'user_id_1',
        sellerId: 'seller_id_1',
        amount: 500000,
        quantity: 2,
        escrowId: '60d5ec49f1a2c12345678902',
        status: 'pending',
        createdAt: '2025-08-18T15:34:00.000Z',
        updatedAt: '2025-08-18T15:34:00.000Z',
        __v: 0,
      }]
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Admin access required',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    }
  })
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get('buyer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Get buyer orders', 
    description: 'Retrieves all orders for the authenticated buyer.' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiResponse({
    status: 200,
    description: 'List of buyer orders',
    type: [Order],
    schema: {
      example: [{
        _id: '60d5ec49f1a2c12345678903',
        productId: {
          _id: '60d5ec49f1a2c12345678901',
          name: 'Laptop',
          price: 250000,
        },
        buyerId: 'current_user_id',
        sellerId: 'seller_id_1',
        amount: 500000,
        quantity: 2,
        escrowId: '60d5ec49f1a2c12345678902',
        status: 'pending',
        createdAt: '2025-08-18T15:34:00.000Z',
        updatedAt: '2025-08-18T15:34:00.000Z',
        __v: 0,
      }]
    }
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
  findByBuyer(@Request() req): Promise<Order[]> {
    return this.ordersService.findByBuyer(req.user.userId);
  }

  @Get('seller')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Get seller orders', 
    description: 'Retrieves all orders for the authenticated seller.' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiResponse({
    status: 200,
    description: 'List of seller orders',
    type: [Order],
    schema: {
      example: [{
        _id: '60d5ec49f1a2c12345678903',
        productId: {
          _id: '60d5ec49f1a2c12345678901',
          name: 'Laptop',
          price: 250000,
        },
        buyerId: 'buyer_id_1',
        sellerId: 'current_user_id',
        amount: 500000,
        quantity: 2,
        escrowId: '60d5ec49f1a2c12345678902',
        status: 'pending',
        createdAt: '2025-08-18T15:34:00.000Z',
        updatedAt: '2025-08-18T15:34:00.000Z',
        __v: 0,
      }]
    }
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
  findBySeller(@Request() req): Promise<Order[]> {
    return this.ordersService.findBySeller(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get order by ID', 
    description: 'Retrieves detailed information about a specific order.' 
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '60d5ec49f1a2c12345678903',
    schema: {
      type: 'string',
      pattern: '^[a-f\\d]{24}$'
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Order details',
    type: Order,
    schema: {
      example: {
        _id: '60d5ec49f1a2c12345678903',
        productId: {
          _id: '60d5ec49f1a2c12345678901',
          name: 'Laptop',
          price: 250000,
        },
        buyerId: 'buyer_id_1',
        sellerId: 'seller_id_1',
        amount: 500000,
        quantity: 2,
        escrowId: '60d5ec49f1a2c12345678902',
        status: 'pending',
        createdAt: '2025-08-18T15:34:00.000Z',
        updatedAt: '2025-08-18T15:34:00.000Z',
        __v: 0,
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Not Found - Order not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Order not found'
      }
    }
  })
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Update order status', 
    description: 'Updates order status (seller only). Valid statuses: pending, processing, dispatched, delivered, cancelled.' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '60d5ec49f1a2c12345678903',
    schema: {
      type: 'string',
      pattern: '^[a-f\\d]{24}$'
    }
  })
  @ApiBody({
    type: UpdateOrderDto,
    examples: {
      dispatchOrder: {
        summary: 'Dispatch order',
        value: {
          status: 'dispatched',
          trackingNumber: 'TRK123456789'
        }
      },
      deliverOrder: {
        summary: 'Mark as delivered',
        value: {
          status: 'delivered'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: Order,
    schema: {
      example: {
        _id: '60d5ec49f1a2c12345678903',
        productId: {
          _id: '60d5ec49f1a2c12345678901',
          name: 'Laptop',
          price: 250000,
        },
        buyerId: 'buyer_id_1',
        sellerId: 'seller_id_1',
        amount: 500000,
        quantity: 2,
        escrowId: '60d5ec49f1a2c12345678902',
        status: 'dispatched',
        trackingNumber: 'TRK123456789',
        createdAt: '2025-08-18T15:34:00.000Z',
        updatedAt: '2025-08-18T15:35:00.000Z',
        __v: 0,
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Bad Request - Invalid status transition',
    schema: {
      example: {
        statusCode: 400,
        message: 'Cannot transition from delivered to dispatched',
        error: 'Bad Request'
      }
    }
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
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Only the seller can update their orders',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Not Found - Order not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Order not found'
      }
    }
  })
  update(
    @Param('id') id: string, 
    @Body() updateOrderDto: UpdateOrderDto, 
    @Request() req
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto, req.user.userId);
  }
}
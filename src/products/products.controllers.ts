import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Product } from './schemas/product.schema';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody, 
  ApiParam,
  ApiHeader,
  ApiSecurity
} from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@ApiSecurity('JWT')
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Create a new product', 
    description: 'Create a new product (seller only). Requires authentication.' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiBody({ 
    type: CreateProductDto,
    examples: {
      example1: {
        value: {
          name: 'Premium Laptop',
          description: '16GB RAM, 1TB SSD, Intel i7',
          price: 1200,
          stock: 15,
          imageUrl: 'https://example.com/laptop.jpg'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Product created successfully',
    type: Product
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Invalid input data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Only sellers can create products' 
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req
  ): Promise<Product> {
    return this.productsService.create(createProductDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all products', 
    description: 'Returns a list of all available products. No authentication required.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successful operation',
    type: [Product],
    isArray: true
  })
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get('seller')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Get seller products', 
    description: 'Returns products belonging to the authenticated seller.' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successful operation',
    type: [Product],
    isArray: true
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  async findBySeller(@Request() req): Promise<Product[]> {
    return this.productsService.findBySeller(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get product by ID', 
    description: 'Returns detailed information about a specific product.' 
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successful operation',
    type: Product
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found' 
  })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Update product', 
    description: 'Update product information (seller only).' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ 
    type: UpdateProductDto,
    examples: {
      example1: {
        value: {
          name: 'Updated Laptop Name',
          description: 'Updated description',
          price: 1300,
          stock: 10
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Product updated successfully',
    type: Product
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Invalid input data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Only product owner can update' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Delete product', 
    description: 'Delete a product (seller only).' 
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Product deleted successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Only product owner can delete' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found' 
  })
  async remove(
    @Param('id') id: string,
    @Request() req
  ): Promise<void> {
    return this.productsService.remove(id, req.user.userId);
  }
}